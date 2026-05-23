using InfraPM.Api.Domain.Entities;
using InfraPM.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class CreateCommentDto
        {
            public Guid ProjectId { get; set; }
            public string Text { get; set; } = string.Empty;
        }

        public class ResolveCommentDto
        {
            public bool IsRejected { get; set; }
            public string? AdminRemarks { get; set; }
        }

        // Fetch comments for the logged-in user or all comments if Superuser
        [HttpGet]
        public async Task<IActionResult> GetComments()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            IQueryable<ProjectComment> query = _context.ProjectComments.Include(c => c.Project);

            // If not superuser, only show comments relevant to their assigned projects/created by them
            if (userRole != "Superuser")
            {
                query = query.Where(c => c.UserId == userId);
            }

            var comments = await query.OrderByDescending(c => c.CreatedAt).Select(c => new
            {
                c.Id,
                c.Text,
                ProjectName = c.Project.Name,
                c.IsResolved,
                c.IsRejected,
                c.AdminRemarks,
                c.CreatedAt,
                c.ResolvedAt
            }).ToListAsync();

            return Ok(comments);
        }

        // Project Managers can create pending (Yellow) comments
        [HttpPost]
        [Authorize(Roles = "Manager,Superuser")]
        public async Task<IActionResult> CreateComment(CreateCommentDto dto)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return Unauthorized();

            var comment = new ProjectComment
            {
                ProjectId = dto.ProjectId,
                UserId = user.Id,
                Text = dto.Text,
                IsResolved = false // Defaults to Yellow ✓
            };

            _context.ProjectComments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        // Engineers/Superusers can resolve (Green) or reject comments
        [HttpPost("{id}/resolve")]
        [Authorize(Roles = "Engineer,Superuser")]
        public async Task<IActionResult> ResolveComment(Guid id, ResolveCommentDto dto)
        {
            var comment = await _context.ProjectComments.FindAsync(id);
            if (comment == null) return NotFound();

            comment.IsResolved = true; // Green ✓
            comment.IsRejected = dto.IsRejected;
            comment.AdminRemarks = dto.AdminRemarks;
            comment.ResolvedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(comment);
        }
    }
}
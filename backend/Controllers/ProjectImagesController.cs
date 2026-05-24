using InfraPM.Api.Domain.Entities;
using InfraPM.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetProjectImages(Guid projectId)
        {
            var images = await _context.ProjectImages
                .Where(i => i.ProjectId == projectId)
                .OrderByDescending(i => i.UploadedAt)
                .Select(i => new
                {
                    i.Id,
                    i.ImageCategory,
                    i.CapturedAt,
                    i.UploadedAt,
                    // Convert absolute physical paths to relative URL paths
                    ThumbnailUrl = "/storage/Images/Thumbnails/" + Path.GetFileName(i.ThumbnailPath),
                    OriginalUrl = "/storage/Images/Originals/" + Path.GetFileName(i.OriginalImagePath)
                })
                .ToListAsync();

            return Ok(images);
        }
    }
}
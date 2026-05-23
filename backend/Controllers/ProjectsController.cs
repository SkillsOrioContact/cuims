using InfraPM.Api.Domain.Entities;
using InfraPM.Api.DTOs;
using InfraPM.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            // Fetch Umbrella projects (ParentProjectId == null) and explicitly include their SubProjects
            var projects = await _context.Projects
                .Where(p => p.ParentProjectId == null)
                .Include(p => p.SubProjects)
                .ToListAsync();

            var result = projects.Select(MapToDto).ToList();
            return Ok(result);
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.SubProjects)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            return Ok(MapToDto(project));
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
        {
            var project = new Project
            {
                ParentProjectId = dto.ParentProjectId,
                Name = dto.Name,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Contractor = dto.Contractor,
                Consultants = dto.Consultants,
                ContractCost = dto.ContractCost,
                TSCost = dto.TSCost,
                AACost = dto.AACost,
                PCICost = dto.PCICost
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, MapToDto(project));
        }

        private static ProjectDto MapToDto(Project p)
        {
            return new ProjectDto
            {
                Id = p.Id,
                ParentProjectId = p.ParentProjectId,
                Name = p.Name,
                Description = p.Description,
                Status = p.Status,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Contractor = p.Contractor,
                Consultants = p.Consultants,
                ContractCost = p.ContractCost,
                TotalAmountPaid = p.TotalAmountPaid,
                TotalAmountRemaining = p.TotalAmountRemaining,
                TSCost = p.TSCost,
                AACost = p.AACost,
                PCICost = p.PCICost,
                RevisedCost = p.RevisedCost,
                CreatedAt = p.CreatedAt,
                SubProjects = p.SubProjects.Select(sp => new ProjectDto
                {
                    Id = sp.Id,
                    ParentProjectId = sp.ParentProjectId,
                    Name = sp.Name,
                    Status = sp.Status,
                    ContractCost = sp.ContractCost
                }).ToList()
            };
        }
    }
}
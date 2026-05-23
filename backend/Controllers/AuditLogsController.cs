using InfraPM.Api.DTOs;
using InfraPM.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Superuser")]
    public class AuditLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuditLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/auditlogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetAuditLogs()
        {
            var logs = await _context.AuditLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(100) // Default pagination constraint
                .Select(l => new AuditLogDto
                {
                    Id = l.Id,
                    Action = l.Action,
                    EntityName = l.EntityName,
                    EntityId = l.EntityId,
                    UserId = l.UserId,
                    Timestamp = l.Timestamp,
                    OldValues = l.OldValues,
                    NewValues = l.NewValues,
                    Reason = l.Reason
                })
                .ToListAsync();

            return Ok(logs);
        }
    }
}
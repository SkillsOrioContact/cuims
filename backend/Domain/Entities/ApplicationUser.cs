using Microsoft.AspNetCore.Identity;

namespace InfraPM.Api.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        // Superuser notes strictly visible to superusers
        public string? SuperuserNotes { get; set; }

        // Force the user to change password on first login
        public bool RequiresPasswordChange { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
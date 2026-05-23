using InfraPM.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfraPM.Api.Domain.Entities
{
    public class Project
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Self-referencing FK for Umbrella/Mega vs Subprojects
        public Guid? ParentProjectId { get; set; }
        public Project? ParentProject { get; set; }
        public ICollection<Project> SubProjects { get; set; } = new List<Project>();

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ProjectStatus Status { get; set; } = ProjectStatus.Draft;

        // Maps Integration (Only required for Single/Sub projects, but optional for Umbrella)
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Civil Engineering Enterprise Fields
        public string? Contractor { get; set; }
        public string? Consultants { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ContractCost { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmountPaid { get; set; }

        // Calculated property, not mapped to DB directly (or can be mapped if preferred)
        [NotMapped]
        public decimal TotalAmountRemaining => ContractCost - TotalAmountPaid;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TSCost { get; set; } // Technical Sanction Cost

        [Column(TypeName = "decimal(18,2)")]
        public decimal AACost { get; set; } // Administrative Approval Cost

        [Column(TypeName = "decimal(18,2)")]
        public decimal PCICost { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RevisedCost { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties for relationships
        public ICollection<ProjectComment> Comments { get; set; } = new List<ProjectComment>();
        public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
    }
}
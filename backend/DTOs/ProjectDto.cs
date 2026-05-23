using InfraPM.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace InfraPM.Api.DTOs
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public Guid? ParentProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProjectStatus Status { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public string? Contractor { get; set; }
        public string? Consultants { get; set; }

        public decimal ContractCost { get; set; }
        public decimal TotalAmountPaid { get; set; }
        public decimal TotalAmountRemaining { get; set; }
        public decimal TSCost { get; set; }
        public decimal AACost { get; set; }
        public decimal PCICost { get; set; }
        public decimal RevisedCost { get; set; }

        public DateTime CreatedAt { get; set; }

        // Include minimal info for sub-projects when fetching Umbrella projects
        public List<ProjectDto> SubProjects { get; set; } = new List<ProjectDto>();
    }

    public class CreateProjectDto
    {
        public Guid? ParentProjectId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Contractor { get; set; }
        public string? Consultants { get; set; }
        public decimal ContractCost { get; set; }
        public decimal TSCost { get; set; }
        public decimal AACost { get; set; }
        public decimal PCICost { get; set; }
    }
}
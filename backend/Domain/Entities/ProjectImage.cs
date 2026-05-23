namespace InfraPM.Api.Domain.Entities
{
    public class ProjectImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public string OriginalImagePath { get; set; } = string.Empty;
        public string ThumbnailPath { get; set; } = string.Empty;

        // E.g., "Before", "After", "Progress"
        public string ImageCategory { get; set; } = "Progress";

        public DateTime CapturedAt { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
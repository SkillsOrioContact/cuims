namespace InfraPM.Api.Domain.Entities
{
    public class ProjectComment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public string UserId { get; set; } = string.Empty; // Manager who left comment
        public ApplicationUser User { get; set; } = null!;

        public string Text { get; set; } = string.Empty;

        // Feedback Loop (Yellow / Green checkmarks)
        public bool IsResolved { get; set; } = false; // False = Yellow, True = Green
        public bool IsRejected { get; set; } = false;

        public string? AdminRemarks { get; set; } // Reason if rejected

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }
    }
}
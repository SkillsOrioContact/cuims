namespace InfraPM.Api.Domain.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Action { get; set; } = string.Empty; // e.g. "CREATE", "UPDATE", "DELETE"

        public string EntityName { get; set; } = string.Empty; // e.g. "Project"

        public string EntityId { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // JSONB representation of the entity state
        public string? OldValues { get; set; }

        public string? NewValues { get; set; }

        // For compliance: mandatory reason if Action == "DELETE"
        public string? Reason { get; set; }
    }
}
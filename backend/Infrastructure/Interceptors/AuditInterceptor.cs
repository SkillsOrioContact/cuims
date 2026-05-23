using InfraPM.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Security.Claims;
using System.Text.Json;

namespace InfraPM.Api.Infrastructure.Interceptors
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            LogChanges(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            LogChanges(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void LogChanges(DbContext? context)
        {
            if (context == null) return;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.Entity is not AuditLog &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted))
                .ToList();

            if (!entries.Any()) return;

            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? "System";
            var auditLogs = new List<AuditLog>();

            foreach (var entry in entries)
            {
                var auditLog = new AuditLog
                {
                    EntityName = entry.Entity.GetType().Name,
                    UserId = userId,
                    Timestamp = DateTime.UtcNow
                };

                // Capture Primary Key (assumes single PK named "Id")
                var pkProperty = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey());
                auditLog.EntityId = pkProperty?.CurrentValue?.ToString() ?? "Unknown";

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditLog.Action = "CREATE";
                        auditLog.NewValues = JsonSerializer.Serialize(entry.CurrentValues.ToObject());
                        break;

                    case EntityState.Deleted:
                        auditLog.Action = "DELETE";
                        auditLog.OldValues = JsonSerializer.Serialize(entry.OriginalValues.ToObject());
                        break;

                    case EntityState.Modified:
                        auditLog.Action = "UPDATE";
                        var oldVals = new Dictionary<string, object?>();
                        var newVals = new Dictionary<string, object?>();

                        foreach (var prop in entry.Properties)
                        {
                            if (prop.IsModified)
                            {
                                oldVals[prop.Metadata.Name] = prop.OriginalValue;
                                newVals[prop.Metadata.Name] = prop.CurrentValue;
                            }
                        }
                        auditLog.OldValues = JsonSerializer.Serialize(oldVals);
                        auditLog.NewValues = JsonSerializer.Serialize(newVals);
                        break;
                }

                auditLogs.Add(auditLog);
            }

            // We must add the AuditLogs without triggering the interceptor again
            context.AddRange(auditLogs);
        }
    }
}
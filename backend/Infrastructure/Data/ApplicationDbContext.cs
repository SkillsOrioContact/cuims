using InfraPM.Api.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InfraPM.Api.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectComment> ProjectComments { get; set; }
        public DbSet<ProjectImage> ProjectImages { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Umbrella/Mega vs Subprojects self-referencing hierarchy
            builder.Entity<Project>()
                .HasOne(p => p.ParentProject)
                .WithMany(p => p.SubProjects)
                .HasForeignKey(p => p.ParentProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure JSONB for AuditLog
            builder.Entity<AuditLog>()
                .Property(a => a.OldValues)
                .HasColumnType("jsonb");

            builder.Entity<AuditLog>()
                .Property(a => a.NewValues)
                .HasColumnType("jsonb");

            // Project -> Comments relationship
            builder.Entity<ProjectComment>()
                .HasOne(c => c.Project)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Comment -> User relationship
            builder.Entity<ProjectComment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Project -> Images relationship
            builder.Entity<ProjectImage>()
                .HasOne(i => i.Project)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
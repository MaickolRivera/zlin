using Microsoft.EntityFrameworkCore;
using Zlin.Api.Domain;

namespace Zlin.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ShortLink> Links => Set<ShortLink>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256);
            e.Property(u => u.Username).HasMaxLength(50);
        });

        b.Entity<ShortLink>(e =>
        {
            e.HasIndex(l => l.Code).IsUnique();
            e.Property(l => l.Code).HasMaxLength(16);
            e.Property(l => l.OriginalUrl).HasMaxLength(2048);
            e.HasOne(l => l.User).WithMany(u => u.Links).HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

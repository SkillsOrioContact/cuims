using InfraPM.Api.Domain.Entities;
using InfraPM.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkiaSharp;
using System.IO;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ImagesController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload/{projectId}")]
        public async Task<IActionResult> UploadImage(Guid projectId, IFormFile file, [FromForm] string category = "Progress")
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Basic Content Type Validation
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest("Invalid image format.");

            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
                return NotFound("Project not found.");

            // Create directories if they don't exist
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Storage", "Images", "Originals");
            var thumbsFolder = Path.Combine(_env.ContentRootPath, "Storage", "Images", "Thumbnails");
            Directory.CreateDirectory(uploadsFolder);
            Directory.CreateDirectory(thumbsFolder);

            // Sanitize file name to prevent path traversal
            var extension = Path.GetExtension(file.FileName);
            var safeFileName = Path.GetFileNameWithoutExtension(file.FileName);
            safeFileName = string.Join("_", safeFileName.Split(Path.GetInvalidFileNameChars()));

            var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}{extension}";
            var originalPath = Path.Combine(uploadsFolder, uniqueFileName);
            var thumbPath = Path.Combine(thumbsFolder, $"thumb_{uniqueFileName}");

            // Save original asynchronously
            using (var stream = new FileStream(originalPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Generate thumbnail using SkiaSharp (Cross-platform)
            using (var originalBitmap = SKBitmap.Decode(originalPath))
            {
                if (originalBitmap == null)
                {
                    // Clean up invalid original file before returning
                    System.IO.File.Delete(originalPath);
                    return BadRequest("Uploaded file is corrupted or is not a valid image format.");
                }

                var thumbBitmap = originalBitmap.Resize(new SKImageInfo(250, 250), SKSamplingOptions.Default);
                using var image = SKImage.FromBitmap(thumbBitmap);
                using var data = image.Encode(SKEncodedImageFormat.Jpeg, 80);
                using var stream = System.IO.File.OpenWrite(thumbPath);
                data.SaveTo(stream);
            }

            var projectImage = new ProjectImage
            {
                ProjectId = projectId,
                OriginalImagePath = originalPath,
                ThumbnailPath = thumbPath,
                ImageCategory = category,
                CapturedAt = DateTime.UtcNow,
                UploadedAt = DateTime.UtcNow
            };

            _context.ProjectImages.Add(projectImage);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Image uploaded and thumbnail generated successfully.", ImageId = projectImage.Id });
        }
    }
}
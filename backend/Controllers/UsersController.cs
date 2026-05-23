using InfraPM.Api.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace InfraPM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Superuser")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public class CreateUserDto
        {
            [Required]
            public string Username { get; set; } = string.Empty;
            [Required]
            public string Password { get; set; } = string.Empty;
            public string? FullName { get; set; }
            public string? SuperuserNotes { get; set; }
            [Required]
            public string Role { get; set; } = string.Empty; // e.g. Manager, Engineer, Accounts
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            var userExists = await _userManager.FindByNameAsync(dto.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, "User already exists!");

            var user = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = dto.Username,
                FullName = dto.FullName,
                SuperuserNotes = dto.SuperuserNotes,
                RequiresPasswordChange = true // Force password change on first login
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, "User creation failed! Please check user details and try again.");

            // Create role if it doesn't exist
            if (!await _roleManager.RoleExistsAsync(dto.Role))
                await _roleManager.CreateAsync(new IdentityRole(dto.Role));

            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new { Message = "User created successfully!" });
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _userManager.Users.Select(u => new
            {
                u.Id,
                u.UserName,
                u.FullName,
                u.SuperuserNotes,
                u.CreatedAt
            }).ToList();

            return Ok(users);
        }
    }
}
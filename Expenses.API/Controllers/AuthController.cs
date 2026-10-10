using Expenses.API.Data;
using Expenses.API.DTOs;
using Expenses.API.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Expenses.API.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
public class AuthController(AppDbContext context, IPasswordHasher<User> passwordHasher) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpPost("Register")]
    public IActionResult Register([FromBody] RegisterUserDTO payload)
    {
        if (_context.Users.Any(u => u.Email == payload.Email))
            return BadRequest("This e-mail address is already taken");

        var hashedPassword = passwordHasher.HashPassword(null, payload.Password);

        var newUser = new User()
        {
            Email = payload.Email,
            Password = hashedPassword,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(newUser);
        _context.SaveChanges();

        var token = GenerateJwtToken(newUser);

        return Ok(new {Token = token});
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginUserDTO payload)
    {
        var user =_context.Users.FirstOrDefault(u => u.Email == payload.Email);

        if (user is null)
            return Unauthorized("Invalid credentials");

        var passwordIsWrong = passwordHasher.VerifyHashedPassword(user, user.Password, payload.Password) == PasswordVerificationResult.Failed;

        if (passwordIsWrong)
            return Unauthorized("Invalid credentials");

        var token = GenerateJwtToken(user);

        return Ok(new {Token = token});
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TestKey1234567890123456789012345"));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "test.com",
            audience: "test.com",
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

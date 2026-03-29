using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        if (_db.Users.Any(x => x.Username == dto.Username))
        {
            return BadRequest("User already exists");
        }
        if (dto.Password != dto.ConfirmPassword)
            return BadRequest("Password not match");

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hash
        };

        _db.Users.Add(user);
        _db.SaveChanges();

        return Ok(new
        {
            message = "Register success"
        });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _db.Users.FirstOrDefault(x => x.Username == dto.Username);

        if (user == null)
            return Unauthorized("User not found");

        bool valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!valid)
            return Unauthorized("Wrong password");

        var token = GenerateJwt(user.Username);

        return Ok(new
        {
            token,
            username = user.Username
        });
    }

    private string GenerateJwt(string username)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("d2f9f6b03b8fbee41f14c05cece64e31a33a69b0734f131829d7753317afe390")
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

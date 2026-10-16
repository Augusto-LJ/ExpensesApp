using Expenses.API.DTOs;
using Expenses.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Expenses.API.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[Authorize]
public class TransactionsController(ITransactionsService service) : ControllerBase
{
    private readonly ITransactionsService _service = service;

    [HttpPost]
    public IActionResult Create([FromBody] CreateTransactionDTO payload)
    {
        var nameIdentifierClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(nameIdentifierClaim))
            return Unauthorized();

        if (!int.TryParse(nameIdentifierClaim, out var userId))
            return BadRequest("Invalid user identifier.");

        var transaction = _service.Create(payload, userId);

        return Ok(transaction);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var nameIdentifierClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(nameIdentifierClaim))
            return Unauthorized();

        if (!int.TryParse(nameIdentifierClaim, out var userId))
            return BadRequest("Invalid user identifier.");

        var allTransactions = _service.GetAll(userId);
        return Ok(allTransactions);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var transaction = _service.GetById(id);

        if (transaction is null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UpdateTransactionDTO payload)
    {
        var newTransaction = _service.Update(id, payload);

        if (newTransaction is null)
            return NotFound();

        return Ok(newTransaction);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return NoContent();
    }
}
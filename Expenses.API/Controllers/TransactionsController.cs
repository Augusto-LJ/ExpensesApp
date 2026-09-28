using Expenses.API.Data;
using Expenses.API.DTOs;
using Expenses.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Expenses.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class TransactionsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpPost]
    public IActionResult CreateTransaction([FromBody] CreateTransactionDTO payload)
    {
        var transaction = new Transaction
        {
            Type = payload.Type,
            Amount = payload.Amount,
            Category = payload.Category,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        _context.SaveChanges();

        return Ok();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var allTransactions = _context.Transactions.ToList();
        return Ok(allTransactions);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var transaction = _context.Transactions.Find(id);

        if (transaction is null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTransaction(int id, [FromBody] UpdateTransactionDTO payload)
    {
        var transaction = _context.Transactions.Find(id);

        if (transaction is null)
            return NotFound();

        transaction.Type = payload.Type;
        transaction.Amount = payload.Amount;
        transaction.Category = payload.Category;
        transaction.UpdatedAt = DateTime.UtcNow;

        _context.Transactions.Update(transaction);
        _context.SaveChanges();

        return Ok(transaction);
    }
}
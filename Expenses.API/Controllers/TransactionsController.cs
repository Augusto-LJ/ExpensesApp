using Expenses.API.DTOs;
using Expenses.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Expenses.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class TransactionsController(ITransactionsService service) : ControllerBase
{
    private readonly ITransactionsService _service = service;

    [HttpPost]
    public IActionResult Create([FromBody] CreateTransactionDTO payload)
    {
        var transaction = _service.Create(payload);

        return Ok(transaction);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var allTransactions = _service.GetAll();
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
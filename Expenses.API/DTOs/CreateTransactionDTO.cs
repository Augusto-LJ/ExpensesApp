namespace Expenses.API.DTOs;

public class CreateTransactionDTO
{
    public string Type { get; set; }
    public double Amount { get; set; }
    public string Category { get; set; }
    public DateTime CreatedAt { get; set; }
}

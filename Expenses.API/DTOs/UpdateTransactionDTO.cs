namespace Expenses.API.DTOs;

public class UpdateTransactionDTO
{
    public string Type { get; set; }
    public double Amount { get; set; }
    public string Category { get; set; }
}

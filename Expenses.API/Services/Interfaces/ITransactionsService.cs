using Expenses.API.DTOs;
using Expenses.API.Models;

namespace Expenses.API.Services.Interfaces;

public interface ITransactionsService
{
    Transaction Create(CreateTransactionDTO payload, int userId);
    List<Transaction> GetAll(int userId);
    Transaction? GetById(int id);
    Transaction? Update(int id, UpdateTransactionDTO transaction);
    void Delete(int id);
}

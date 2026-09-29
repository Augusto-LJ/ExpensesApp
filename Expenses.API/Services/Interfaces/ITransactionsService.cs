using Expenses.API.DTOs;
using Expenses.API.Models;

namespace Expenses.API.Services.Interfaces;

public interface ITransactionsService
{
    Transaction Create(CreateTransactionDTO payload);
    List<Transaction> GetAll();
    Transaction? GetById(int id);
    Transaction? Update(int id, UpdateTransactionDTO transaction);
    void Delete(int id);
}

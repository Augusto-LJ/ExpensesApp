using Expenses.API.Data;
using Expenses.API.DTOs;
using Expenses.API.Models;
using Expenses.API.Services.Interfaces;

namespace Expenses.API.Services;

public class TransactionsService(AppDbContext context) : ITransactionsService
{
    private readonly AppDbContext _context = context;

    public Transaction Create(CreateTransactionDTO transaction, int userId)
    {
        var newTransaction = new Transaction
        {
            Type = transaction.Type,
            Amount = transaction.Amount,
            Category = transaction.Category,
            CreatedAt = transaction.CreatedAt,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _context.Transactions.Add(newTransaction);
        _context.SaveChanges();

        return newTransaction;
    }

    public void Delete(int id)
    {
        var transaction = _context.Transactions.Find(id);

        if (transaction is not null)
        {
            _context.Transactions.Remove(transaction);
            _context.SaveChanges();
        }
    }

    public List<Transaction> GetAll(int userId)
    {
        var allTransactions = _context.Transactions
            .Where(t => t.UserId == userId)
            .ToList();

        return allTransactions;
    }

    public Transaction? GetById(int id)
    {
        var transaction = _context.Transactions.Find(id);

        return transaction;
    }

    public Transaction? Update(int id, UpdateTransactionDTO transaction)
    {
        var existingTransaction = _context.Transactions.Find(id);

        if (existingTransaction is not null)
        {
            existingTransaction.Type = transaction.Type;
            existingTransaction.Amount = transaction.Amount;
            existingTransaction.Category = transaction.Category;
            existingTransaction.UpdatedAt = DateTime.UtcNow;

            _context.Transactions.Update(existingTransaction);
            _context.SaveChanges();
        }

        return existingTransaction;
    }
}
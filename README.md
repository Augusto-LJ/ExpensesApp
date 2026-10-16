# 💸 ExpensesApp

**ExpensesApp** is a full-stack personal finance application for tracking income and expenses. It combines an Angular single-page application with an ASP.NET Core REST API and SQL Server persistence.

The project demonstrates end-to-end application development: account registration and login, JWT-based API authentication, transaction management, and a dashboard that summarizes income, expenses, and net balance.

## ✨ Features

- 🔐 Register and log in with an email and password
- 🪪 Issue and store a JWT after successful authentication
- 🛡️ Protect transaction pages in the client and transaction API endpoints with authentication
- 📋 View transactions with date, type, category, and amount
- ➕ Create, ✏️ edit, and 🗑️ delete transactions
- 📊 Calculate total income, total expenses, and net balance
- 🧾 Choose from income- and expense-specific categories
- ✅ Validate required form fields, email format, password confirmation, and positive amounts
- 📱 Use a responsive interface styled with Bootstrap

Each transaction contains an `id`, `type`, `amount`, `category`, `createdAt`, and `updatedAt`. New transactions are associated with the authenticated user when they are created, and the list endpoint filters results by the user ID in the JWT.

## 📸 Demo
### Login page
<img width="1919" height="990" alt="image" src="https://github.com/user-attachments/assets/645f8431-581d-4a53-be05-3d3ef25e6622" />

### Registration page
<img width="1919" height="993" alt="image" src="https://github.com/user-attachments/assets/598e2f52-993f-4542-ae05-2244c79e5bad" />

### Transactions page
<img width="1919" height="993" alt="image" src="https://github.com/user-attachments/assets/53a7ed7a-1f09-48fc-bd2b-f8d32cf69251" />

## 🛠️ Technology stack

### Frontend

- **Angular 22** and **TypeScript 6**
- **Angular Router** for page navigation
- **Angular Reactive Forms** for form state and validation
- **Angular Signals** and `computed` values for transaction data and dashboard totals
- **RxJS** and Angular `HttpClient` for asynchronous API requests
- **Bootstrap 5** and **Bootstrap Icons** for responsive styling and interface icons
- **Vitest** for Angular unit tests

### Backend

- **ASP.NET Core Web API** on **.NET 8**
- **Entity Framework Core 8** with the **SQL Server** provider
- **JWT Bearer authentication**
- **ASP.NET Core password hashing** via `PasswordHasher<User>`
- **Swagger / OpenAPI** for interactive API documentation in development

### Development tools

- **Angular CLI**
- **npm**
- **.NET CLI** and Entity Framework Core tools

## 🧭 Application routes

| Route | Purpose | Access |
|---|---|---|
| `/login` | Sign in to an account | Public |
| `/signup` | Create an account | Public |
| `/transactions` | View the transaction list and totals | Authenticated |
| `/add` | Create a transaction | Authenticated |
| `/edit/:id` | Edit a transaction | Authenticated |

## 🔌 API overview

The API is served under `/api`. Authentication endpoints issue a JWT; the Angular HTTP interceptor attaches the token to subsequent API requests.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/Auth/Register` | Register an account |
| `POST` | `/api/Auth/Login` | Authenticate and receive a JWT |
| `GET` | `/api/Transactions` | List the signed-in user's transactions |
| `GET` | `/api/Transactions/{id}` | Retrieve a transaction |
| `POST` | `/api/Transactions` | Create a transaction for the signed-in user |
| `PUT` | `/api/Transactions/{id}` | Update a transaction |
| `DELETE` | `/api/Transactions/{id}` | Delete a transaction |

## 🏗️ Project structure

```text
ExpensesApp/
├── Expenses.API/
│   ├── Controllers/       # Authentication and transaction endpoints
│   ├── Data/              # Entity Framework Core DbContext
│   ├── DTOs/              # API request contracts
│   ├── Migrations/        # Database schema history
│   ├── Models/            # User and transaction entities
│   └── Services/           # Transaction operations and service contract
├── Expenses.Client/
│   └── src/app/
│       ├── components/    # Login, signup, transaction list and form, layout
│       ├── guards/        # Client-side route guard
│       ├── interceptors/  # JWT request interceptor
│       ├── models/        # Client-side data types
│       └── services/      # Authentication and transaction API clients
└── Expenses.API.sln
```

The client separates UI components from API services, route protection, and request interception. On the server, controllers handle HTTP concerns, DTOs describe incoming payloads, and the transaction service and EF Core context handle persistence.

## 🧠 Technical decisions

### Separate client and API

The Angular client and ASP.NET Core API are separate applications. This keeps presentation and persistence concerns independent and makes it possible to evolve or deploy them separately.

### JWT authentication

The API returns a JWT on registration and login. The client stores it in browser `localStorage`, uses an Angular route guard for authenticated pages, and attaches it to HTTP requests through an interceptor. The API uses the token's user identifier when creating transactions and filtering the list.

### Reactive forms

Login, signup, and transaction entry use Angular Reactive Forms. Validation is declared alongside each form's controls, keeping input rules and form state explicit.

### Signals for dashboard state

The transaction list stores its data in an Angular signal. Computed signals derive income, expense, and net balance totals from that state, so the dashboard stays consistent with the displayed transactions.

### Entity Framework Core migrations

The API uses EF Core migrations to version database schema changes. The current default connection string targets SQL Server LocalDB for local development.

## 🚀 Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server LocalDB (the default connection string is configured for Windows LocalDB)
- Entity Framework Core CLI (`dotnet-ef`) for applying migrations

### 1. Configure the database

The default connection string is in `Expenses.API/appsettings.json` and points to a local SQL Server LocalDB database. Update `ConnectionStrings:DefaultConnection` if you want to use a different SQL Server instance.

If you do not already have the EF Core CLI installed, install the version matching the API's EF Core dependency:

```bash
dotnet tool install --global dotnet-ef --version 8.0.31
```

From the repository root, apply the migrations:

```bash
dotnet ef database update --project Expenses.API/Expenses.API.csproj
```

### 2. Start the API

From the repository root, run:

```bash
dotnet run --project Expenses.API/Expenses.API.csproj
```

The HTTPS launch profile uses `https://localhost:7023` and serves Swagger at `https://localhost:7023/swagger` in development. If prompted, trust the local ASP.NET Core development certificate:

```bash
dotnet dev-certs https --trust
```

The client currently calls the API at `https://localhost:7023`; if you change the API's address, update the API URL in the client services as well.

### 3. Start the Angular client

In a separate terminal:

```bash
cd Expenses.Client
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200), then create an account or sign in.

## 🧪 Tests and production build

Run the Angular unit tests from `Expenses.Client`:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

The Angular CLI writes the build output under `Expenses.Client/dist/`.

## 📌 Potential improvements

- [ ] Add broader unit and integration test coverage for the client and API
- [ ] Add end-to-end tests for registration, authentication, and transaction workflows
- [ ] Add loading indicators and consistent user-facing API error handling
- [ ] Add search, filtering, sorting, and pagination to the transaction list
- [ ] Add transaction ownership checks to every read, update, and delete operation
- [ ] Move JWT signing configuration to secure environment-specific settings and restrict CORS for deployment
- [ ] Add reporting by date range, category, and monthly budget
- [ ] Add CI/CD workflows and containerized development setup

## 👨‍💻 About

ExpensesApp is a portfolio project focused on practical full-stack development with **Angular**, **ASP.NET Core**, **JWT authentication**, and **Entity Framework Core**. It brings together a working financial-tracking workflow and demonstrates how a typed frontend can communicate with a structured REST API backed by a relational database.

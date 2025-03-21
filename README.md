# FlashTron

FlashTron is a cryptocurrency wallet application built on the TRON blockchain. It allows users to manage their TRX and USDT balances, perform transactions, and view transaction history.

## Features

- **User Authentication**: Secure login and registration system.
- **Wallet Management**: View TRX and USDT balances.
- **Transactions**: Send TRX and USDT to other addresses.
- **Transaction History**: View past transactions with statuses.
- **Flash Transactions**: Create and execute flash transactions with specific expiry times.
- **Docker Support**: Deploy easily using `docker-compose` without worrying about local setup.

## Prerequisites

- **Docker & Docker Compose**: Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Setup with Docker

The project includes a `docker-compose.yml` file to simplify deployment.

### 1. Clone the Repository

```bash
git clone https://github.com/rustpan/FlashTron.git
cd FlashTron
```

### 2. Start the Application

```bash
docker-compose up -d --build
```

This will:
- Start a **MongoDB database**.
- Start the **backend server**.
- Start the **React frontend**.

### 3. Access the Application

- **Backend API**: `http://localhost:3000`
- **Frontend UI**: `http://localhost:3001`

### 4. Stopping the Application

```bash
docker-compose down
```

## Running Without Docker (Manual Setup)

If you prefer not to use Docker, follow these steps.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TRON_FULL_NODE=https://api.shasta.trongrid.io
TRON_SOLIDITY_NODE=https://api.shasta.trongrid.io
TRON_EVENT_SERVER=https://api.shasta.trongrid.io
USDT_CONTRACT_ADDRESS=your_usdt_contract_address
```

### 3. Run the Server

```bash
npm start
```

### 4. Run the Frontend

```bash
cd client
npm install
npm start
```

The frontend will be accessible at `http://localhost:3001`.

## Testing with Two Users

To test transactions between two different users:

1. **Open Two Browser Windows**:
   - Use **Google Chrome** for User A.
   - Use **Firefox (or incognito mode)** for User B.

2. **Login/Register with Different Accounts**:
   - Register and log in as **User A** in one browser.
   - Register and log in as **User B** in another browser.

3. **Perform a Transaction**:
   - User A sends TRX/USDT to User B’s wallet address.
   - The transaction appears in both accounts.

4. **Check Transaction Status**:
   - View pending, completed, or failed transactions in history.
   - Verify transactions via TRON blockchain explorer.

## API Endpoints

- **`POST /register`** → Register a new user.
- **`POST /login`** → Authenticate a user and retrieve a token.
- **`GET /wallet`** → Retrieve wallet information.
- **`POST /create_flash_transaction`** → Create a new flash transaction.
- **`POST /execute_transaction`** → Execute a pending flash transaction.
- **`GET /transactions`** → Retrieve transaction history.
- **`POST /logout`** → Logout the authenticated user.

## Security Considerations

- **JWT Authentication** for secure user sessions.
- **Data Validation** to prevent incorrect transactions.
- **Environment Variables** to store sensitive data securely.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request for any enhancements or bug fixes.

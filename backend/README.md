# Decentralized Lottery Backend API

Backend API service for a Decentralized Lottery Application that interacts with blockchain technology.

## Description

This service provides the API endpoints needed to interact with a decentralized lottery smart contract. It handles blockchain integration through ethers.js and exposes a RESTful API for frontend applications.

## Prerequisites

- Node.js (v14 or higher recommended)
- pnpm
- Access to an Ethereum node or provider (Infura, Alchemy, etc.)
- Smart contract deployment details

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd lfg-test/backend
```

2. Install dependencies:

```bash
pnpm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=3001
NODE_ENV=development
ETHEREUM_NETWORK=sepolia
ETHEREUM_PROVIDER_URL=https://provider-url.com
```

## Running the Application

### Development Mode

This starts the server with nodemon which automatically restarts on file changes:

```bash
pnpm dev
```

### Production Mode

```bash
pnpm start
```

## Testing

Run the test suite:

```bash
pnpm test
```

## API Endpoints

The API provides endpoints for:

- Getting lottery information
- Purchasing tickets
- Checking lottery results
- Claiming winnings

Refer to the API documentation for detailed endpoint information.

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # Data models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── tests/            # Test files
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Package information
├── README.md         # Project documentation
└── server.js         # Application entry point
```

## Api Document
cURL Commands for Testing Lottery API Endpoints
Here are curl commands to test all the API endpoints defined in your lottery routes:

1. Get All Draws History
```bash
curl -X GET http://localhost:3001/api/lottery/draws
```
2. Get a Specific Draw by ID
```bash
curl -X GET http://localhost:3001/api/lottery/draws/1
```
3. Save New Draw
```bash
curl -X POST http://localhost:3001/api/lottery/draws \
  -H "Content-Type: application/json" \
  -d '{
    "drawId": 1,
    "prize": "5 ETH",
    "drawDate": "2025-03-15T15:00:00Z"
  }'
```
4. Update Draw with Result
```bash
curl -X PUT http://localhost:3001/api/lottery/draws/1/result \
  -H "Content-Type: application/json" \
  -d '{
    "winningTicket": "12345",
    "winner": "0x123456789abcdef123456789abcdef123456789a"
  }'
```
To test these endpoints in sequence:

First create a new draw using the POST request
Then get all draws to verify it was created
Then get the specific draw by its ID
Finally update it with a result and get it again to see the updated data
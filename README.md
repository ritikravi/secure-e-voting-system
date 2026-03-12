<<<<<<< HEAD
# Secure Blockchain-Based E-Voting System (Hackathon Prototype)

This project is a decentralized voting platform built for a hackathon. It uses Ethereum (Hardhat) for immutable vote storage and MongoDB for voter authentication.

## Tech Stack
-   **Frontend**: React.js, ethers.js, Lucide React, Framer Motion
-   **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
-   **Blockchain**: Solidity, Hardhat, Ethers.js
-   **Wallet**: MetaMask

## Project Structure
-   `/blockchain`: Smart contracts and deployment scripts.
-   `/backend`: API for voter authentication and registration.
-   `/frontend`: React application for the voting interface.

## How to Run Locally

### 1. Prerequisites
-   Node.js installed
-   MetaMask extension in browser
-   MongoDB running locally (default: `mongodb://localhost:27017/evoting`)

### 2. Configure MetaMask for Localhost
To interact with the local blockchain, add a custom network to MetaMask:
- **Network Name**: Hardhat Local
- **New RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: ETH

*Note: Import one of the private keys displayed when running `npx hardhat node` into MetaMask to have test funds.*
```bash
cd blockchain
npm install
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```
*Note: Copy the deployed contract address and update it in `frontend/src/App.jsx`.*

### 3. Setup Backend
```bash
cd backend
npm install
node server.js
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Voter Workflow
1.  **Register**: Create a voter entry (can be done via API or simple script).
2.  **Login**: Use Voter ID and OTP (simulated as `123456`).
3.  **Vote**: Select a candidate and sign the transaction via MetaMask.
4.  **Verify**: View results directly on the dashboard (fetched from blockchain).
=======
# secure-e-voting-system
A blockchain-based secure e-voting system that ensures transparent, tamper-proof, and decentralized digital elections.
>>>>>>> 1200b91f9e05ff13a33b6e6ff3385998f3b904ad

# Supply Chain Ethereum Project

## Project Overview
This is a Hardhat 3 Beta blockchain project implementing a supply chain tracking system on Ethereum. The project consists of smart contracts for product tracking and a React frontend for user interaction.

## Architecture
- **Smart Contracts**: Solidity contracts for supply chain management
- **Frontend**: React application with ethers.js integration
- **Testing**: Mocha and Foundry-compatible tests
- **Deployment**: Hardhat Ignition for contract deployment

## Key Components

### Smart Contracts (`/contracts/`)
- **SupplyChain.sol**: Main contract for product tracking and ownership management
  - Product struct with id, name, owner, timestamp
  - Functions: addProduct(), transferOwnership(), getProduct()
  - Events: ProductAdded, OwnershipTransferred
- **Counter.sol**: Example counter contract (from Hardhat template)

### Frontend (`/frontend/`)
- **React Application**: Web3-enabled frontend
  - Contract interaction via ethers.js
  - MetaMask integration required
  - Product management UI (add, view, transfer ownership)
- **Dependencies**: React 19, ethers.js 6.15.0
- **Note**: Contract address needs to be updated in App.js:6

### Tests (`/test/`)
- **SupplyChain.js**: Mocha tests for supply chain functionality
- **Counter.ts**: TypeScript tests for counter contract

### Configuration
- **hardhat.config.ts**: Hardhat configuration with network settings
  - Supports local simulation, Sepolia testnet
  - Uses configuration variables for private keys
- **Package Dependencies**: Hardhat 3.0.3, ethers 6.15.0, TypeScript 5.8.0

## Available Commands

### Testing
```bash
npx hardhat test                # Run all tests
npx hardhat test solidity       # Run Solidity tests only
npx hardhat test mocha          # Run Mocha tests only
```

### Frontend
```bash
cd frontend
npm start                       # Start development server
npm run build                   # Build for production
npm test                        # Run frontend tests
```

### Deployment
```bash
# Local deployment
npx hardhat ignition deploy ignition/modules/Counter.ts

# Sepolia deployment (requires SEPOLIA_PRIVATE_KEY)
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```

## Current Issues
1. **Frontend Contract Address**: The contract address in `frontend/src/App.js:6` is a placeholder and needs to be updated after deployment
2. **Test Mismatch**: The test file expects methods like `createItem()`, `shipItem()`, `deliverItem()` which don't exist in the current SupplyChain.sol contract

## Security Considerations
- Contract uses basic access control (owner-only transfers)
- No reentrancy guards implemented
- Input validation present for ownership transfers
- No upgrade mechanisms in place

## Development Notes
- Project uses Hardhat 3 Beta features
- TypeScript integration enabled
- Frontend requires MetaMask for Web3 connectivity
- Contract compilation optimized for production builds (200 runs)
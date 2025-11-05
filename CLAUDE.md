# CoffeeChain - Enhanced Supply Chain Project

## Project Vision
A UX-focused blockchain application that tracks coffee from farm to cup, designed for real-world stakeholders who aren't Web3-native. Built as a comprehensive semester project demonstrating practical blockchain implementation with seamless user experience.

## Enhanced MVP Design

### Target Users & Pain Points

#### 1. Coffee Farmers (Primary Users)
- **Current Pain**: Hard to prove fair trade compliance, delayed payments, no recognition for quality
- **Our Solution**: Simple mobile interface to log harvest batches, get payments when coffee sells
- **Auth**: Email/SMS login → auto-created wallet (no crypto knowledge needed)

#### 2. Coffee Roasters (Business Users)  
- **Current Pain**: Can't verify bean authenticity, hard to tell origin story to customers
- **Our Solution**: Dashboard to receive batches, add roasting data, generate QR codes for packages
- **Auth**: Email login → company dashboard with bulk operations

#### 3. Coffee Consumers (End Users)
- **Current Pain**: Don't know if "fair trade" claims are real, want coffee origin story
- **Our Solution**: Scan QR code → beautiful story page with farm photos, farmer info, journey map
- **Auth**: No login needed - just scan and view

### Simple Supply Chain Flow
```
Farmer → Creates batch → Roaster → Receives & roasts → Consumer → Scans QR code
  ↓          ↓              ↓           ↓               ↓          ↓
Email     Harvest        Email      Roast data      QR scan   Story page
login     details        login      & packaging      only      (no auth)
```

### Core Features (MVP)
1. **Batch Creation**: Farmer logs harvest with basic details (farm, variety, date, kg)
2. **State Transitions**: Harvested → Shipped → Received → Roasted → Packaged
3. **QR Code Generation**: Each packaged batch gets unique QR code
4. **Consumer Verification**: Scan QR → see complete journey + farmer story
5. **Clean UI**: Modern, mobile-first design that looks professional

### Tech Stack (Simplified)
- **Smart Contract**: Enhanced coffee batch tracking with 4 simple states
- **Frontend**: Next.js + RainbowKit + TailwindCSS + shadcn/ui components
- **Auth**: RainbowKit for stakeholders (hides crypto complexity)
- **Database**: Store non-critical data (photos, descriptions) off-chain for better UX
- **QR Codes**: Generated client-side, links to verification page

### Value Proposition
- **For Farmers**: Recognition & fair payments
- **For Roasters**: Brand authenticity & customer trust
- **For Consumers**: Know your coffee's real story
- **For Professor**: Real blockchain application with excellent UX

## Original Project Overview
This started as a basic Hardhat 3 Beta blockchain project implementing a supply chain tracking system on Ethereum. We've enhanced it into a coffee-focused application with real-world stakeholders and UX considerations.

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
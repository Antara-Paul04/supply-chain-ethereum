# CoffeeChain - Blockchain Supply Chain Tracking

A UX-focused blockchain application that tracks coffee from farm to cup, designed for real-world stakeholders who aren't Web3-native. Built as a comprehensive semester project demonstrating practical blockchain implementation with seamless user experience.

## Project Vision

CoffeeChain makes fair trade verification accessible to everyone involved in the coffee supply chain - from farmers who grow the beans to consumers who drink the coffee. By leveraging blockchain technology with a user-friendly interface, we provide transparency and trust without requiring technical expertise.

## Target Users

### Coffee Farmers
- **Pain Point**: Hard to prove fair trade compliance, delayed payments, no recognition for quality
- **Solution**: Simple mobile interface to log harvest batches and receive payments when coffee sells
- **Authentication**: Email/SMS login with auto-created wallet (no crypto knowledge needed)

### Coffee Roasters
- **Pain Point**: Can't verify bean authenticity, hard to tell origin story to customers
- **Solution**: Dashboard to receive batches, add roasting data, and generate QR codes for packages
- **Authentication**: Email login with company dashboard and bulk operations

### Coffee Consumers
- **Pain Point**: Don't know if "fair trade" claims are real, want to know coffee's origin story
- **Solution**: Scan QR code to see beautiful story page with farm photos, farmer info, and journey map
- **Authentication**: No login needed - just scan and view

## Tech Stack

### Smart Contracts
- **Solidity**: Coffee batch tracking with state transitions (Harvested → Shipped → Received → Roasted → Packaged)
- **Hardhat 3**: Development environment, testing, and deployment
- **Deployment Target**: Hoodi testnet (Ethereum L2)

### Frontend
- **Next.js 15**: React framework with App Router and TypeScript
- **RainbowKit**: Web3 authentication that hides crypto complexity
- **wagmi + viem**: Modern Ethereum interaction libraries
- **Magic SDK**: Email/SMS authentication for non-crypto users
- **TailwindCSS**: Utility-first CSS framework
- **QR Code Support**: Generation and scanning for product traceability

### Development Tools
- **TypeScript**: Type-safe development across the stack
- **ESLint**: Code quality and consistency
- **Mocha + Chai**: Contract testing framework

## Project Structure

```
.
├── contracts/              # Solidity smart contracts
│   ├── SupplyChain.sol    # Original supply chain contract
│   └── CoffeeBatch.sol    # Enhanced coffee-specific contract
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   │   ├── farmer/   # Farmer dashboard
│   │   │   ├── roaster/  # Roaster dashboard
│   │   │   ├── verify/   # Consumer verification
│   │   │   └── register/ # Role-based registration
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts (Auth, Web3)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility libraries
│   │   ├── providers/    # Web3 and app providers
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
├── scripts/              # Deployment and utility scripts
├── test/                 # Contract tests
└── hardhat.config.ts     # Hardhat configuration
```

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd supply-chain-ethereum
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Set up environment variables:
```bash
# Create .env file in root directory
cp .env.example .env

# Add your configuration:
# - Private key for deployment
# - RPC URLs for networks
# - Magic SDK API key (for frontend)
```

## Development

### Running the Local Blockchain

Start a local Hardhat node:
```bash
npx hardhat node
```

### Compiling Contracts

Compile the smart contracts:
```bash
npx hardhat compile
```

### Running Tests

Run all tests:
```bash
npx hardhat test
```

Run specific test suites:
```bash
# Solidity tests only
npx hardhat test solidity

# Mocha tests only
npx hardhat test mocha
```

### Deploying Contracts

Deploy to local network:
```bash
npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts
```

Deploy to Hoodi testnet:
```bash
# Set your private key
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# Deploy to Hoodi testnet
npx hardhat ignition deploy --network hoodi ignition/modules/CoffeeBatch.ts
```

### Running the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Building for Production

Build the frontend:
```bash
cd frontend
npm run build
npm start
```

## Core Features

### 1. Batch Creation
Farmers can log harvest batches with:
- Farm name and location
- Coffee variety
- Harvest date
- Weight (in kilograms)
- Additional metadata

### 2. State Transitions
Track coffee through the supply chain:
- **Harvested**: Initial state when farmer creates batch
- **Shipped**: Farmer ships to roaster
- **Received**: Roaster confirms receipt
- **Roasted**: Roaster processes the beans
- **Packaged**: Final product ready for consumers

### 3. QR Code Generation
Each packaged batch receives a unique QR code linking to its verification page

### 4. Consumer Verification
Scan QR code to view:
- Complete journey from farm to package
- Farmer information and story
- Photos and descriptions
- Timestamps and locations
- Chain of custody

### 5. Role-Based Access
- Farmers can only create and ship batches
- Roasters can receive, roast, and package batches
- Consumers can view but not modify data

## Smart Contract Architecture

### CoffeeBatch.sol
Enhanced contract with coffee-specific features:
- Batch struct with detailed metadata
- State machine for supply chain stages
- Role-based access control
- Event emissions for tracking
- Getter functions for transparency

### SupplyChain.sol
Original contract for basic product tracking (kept for reference)

## Security Considerations

- Input validation on all contract functions
- Access control for state transitions
- Event emissions for audit trail
- Non-upgradeable contracts (immutable once deployed)
- Testing coverage for critical paths

## Known Issues

1. Contract addresses must be updated in frontend after deployment
2. Magic SDK requires API key configuration
3. QR code generation is client-side only
4. No database for off-chain data storage yet

## Future Enhancements

- Add IPFS for storing photos and documents
- Implement payment integration for farmer compensation
- Add multi-language support
- Create mobile-first PWA version
- Add analytics dashboard for roasters
- Implement batch splitting and merging
- Add quality ratings and reviews

## Contributing

This is a semester project, but contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## License

This project is created for educational purposes as part of a semester assignment.

## Acknowledgments

- Built with Hardhat 3 Beta
- UI components inspired by modern Web3 applications
- Coffee supply chain flows based on real-world fair trade practices

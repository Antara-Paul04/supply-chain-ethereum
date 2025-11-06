# CoffeeChain Deployment Guide

This guide walks you through deploying the CoffeeChain application from scratch.

## Prerequisites

Before you begin, ensure you have:

- Node.js 20.x or higher installed
- npm or yarn package manager
- Git for version control
- A wallet with testnet funds (MetaMask recommended)
- A code editor (VS Code recommended)

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd supply-chain-ethereum

# Install root dependencies (Hardhat, contracts)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Get External API Keys

### 2.1 Magic SDK API Key (for email authentication)

1. Visit [https://magic.link/](https://magic.link/)
2. Sign up for a free account
3. Create a new application
4. Copy the **Publishable API Key** from your dashboard
5. Save it for later (you'll add it to `.env.local`)

### 2.2 WalletConnect Project ID (for wallet authentication)

1. Visit [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Sign up for a free account
3. Create a new project
4. Copy the **Project ID**
5. Save it for later (you'll add it to `.env.local`)

### 2.3 Get Testnet Funds

You'll need testnet ETH to deploy contracts and test transactions:

**For Sepolia Testnet:**
- Visit [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
- Or [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
- Enter your wallet address
- Request test ETH (usually 0.5-1.0 ETH)

**For Hoodi Testnet:**
- Check Hoodi documentation for their faucet
- Or contact the Hoodi team for testnet funds

## Step 3: Configure Environment Variables

### 3.1 Backend Configuration (Hardhat)

The easiest and most secure way is to use Hardhat Keystore:

```bash
# Set your private key securely
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
# Enter your private key when prompted (it will be encrypted)
```

Alternatively, create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your private key
# WARNING: Never commit this file to git!
```

### 3.2 Frontend Configuration

```bash
# Navigate to frontend directory
cd frontend

# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add these values (we'll fill CONTRACT_ADDRESS after deployment):
# NEXT_PUBLIC_CONTRACT_ADDRESS=  (leave empty for now)
# NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=your_magic_api_key_here
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Step 4: Compile Contracts

```bash
# From the root directory
npx hardhat compile
```

You should see output like:
```
Compiling your Solidity contracts...
✔ Compiled successfully
```

## Step 5: Run Tests (Recommended)

Before deploying, verify everything works:

```bash
npx hardhat test
```

Expected output:
```
  19 passing (445ms)
```

## Step 6: Deploy Smart Contracts

### Option A: Local Network (for testing)

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts --network localhost
```

### Option B: Sepolia Testnet (recommended for development)

```bash
# Deploy to Sepolia
npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts --network sepolia
```

### Option C: Hoodi Testnet

```bash
# First set your Hoodi private key if different from Sepolia
npx hardhat keystore set HOODI_PRIVATE_KEY

# Deploy to Hoodi
npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts --network hoodi
```

### Expected Output

After successful deployment, you should see:

```
✔ Confirm deploy to network sepolia (11155111)? … yes
...
CoffeeBatch deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**IMPORTANT:** Copy the deployed contract address!

## Step 7: Configure Frontend with Contract Address

```bash
# Open frontend/.env.local in your editor
# Update this line with your deployed contract address:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Your complete `frontend/.env.local` should look like:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXX
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123def456ghi789jkl012mno345pq
```

## Step 8: Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

## Step 9: Test the Application

### 9.1 Test Farmer Flow

1. Click "Register as Farmer"
2. Choose authentication method:
   - **Email:** Enter your email (Magic Link will send verification)
   - **Wallet:** Connect with MetaMask or WalletConnect
3. Fill in your farmer details:
   - Name: Your name or farm name
   - Email: Your email
   - Location: Your farm location
4. Click "Register"
5. Navigate to Farmer Dashboard
6. Create a coffee batch:
   - Farm name (pre-filled)
   - Farm location
   - Coffee variety (select from dropdown)
   - Quantity in kg
7. Click "Create Coffee Batch"
8. Wait for transaction confirmation
9. See your batch appear in "Your Coffee Batches"
10. Click "Ship to Roaster" to ship the batch

### 9.2 Test Roaster Flow

1. Open a new incognito/private browser window (or logout)
2. Click "Register as Roaster"
3. Authenticate and fill in roaster details
4. Navigate to Roaster Dashboard
5. You should see the shipped batch in "Available Batches"
6. Click on the batch to select it
7. Fill in roasting details:
   - Roaster name
   - Roast profile (select from dropdown)
8. Click "Complete Roasting"
9. Wait for confirmation
10. Click "Package & Generate QR Code"
11. QR code appears on the right
12. Click "Download QR Code" to save it

### 9.3 Test Consumer Verification

1. Navigate to the Verify page
2. Option 1: Scan QR code using your phone
3. Option 2: Manually enter batch ID (e.g., "0")
4. View the complete coffee journey:
   - Farm information
   - Harvest date
   - Coffee variety
   - Roaster information
   - Roast profile
   - Full timeline

## Step 10: Troubleshooting

### Contract Address Not Set
**Error:** `Contract address not configured`

**Solution:**
1. Verify you deployed the contract successfully
2. Check that `frontend/.env.local` has the correct contract address
3. Restart the Next.js dev server (`npm run dev`)

### Magic Link Not Working
**Error:** `Magic SDK initialization failed`

**Solution:**
1. Verify your Magic API key is correct in `.env.local`
2. Check that you're using the Publishable API Key (starts with `pk_`)
3. Ensure the key is for the correct environment (development/production)

### WalletConnect Not Connecting
**Error:** Wallet connection fails or hangs

**Solution:**
1. Verify your WalletConnect Project ID is correct
2. Try with a different wallet (MetaMask, Coinbase Wallet)
3. Check your browser console for specific errors

### Transaction Fails
**Error:** `Transaction reverted` or `User not registered`

**Solution:**
1. Ensure you registered as the correct role (farmer/roaster)
2. Check you have enough testnet ETH for gas
3. Verify you're connected to the correct network
4. Check browser console for detailed error messages

### Network Mismatch
**Error:** `Wrong network` or `Please switch to Sepolia`

**Solution:**
1. Open MetaMask
2. Click on the network dropdown
3. Select "Sepolia Test Network" (or Hoodi if using that)
4. If the network isn't listed, add it manually using these details:

**Sepolia:**
- Network Name: Sepolia
- RPC URL: https://rpc.sepolia.org
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

**Hoodi:**
- Network Name: Hoodi Testnet
- RPC URL: (from Hoodi docs)
- Chain ID: 560048
- Currency Symbol: ETH
- Block Explorer: (from Hoodi docs)

### Batches Not Loading
**Error:** Farmer/Roaster sees empty batch list

**Solution:**
1. Open browser developer console (F12)
2. Check Network tab for failed requests
3. Verify contract address is correct
4. Ensure you're connected to the right network
5. Try refreshing the page
6. Check that batches exist in the correct state

## Step 11: Production Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Visit [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
5. Deploy

### Smart Contracts (Mainnet)

**WARNING:** Deploying to mainnet requires real ETH and is irreversible!

1. Get real ETH in your wallet
2. Set your mainnet private key securely:
   ```bash
   npx hardhat keystore set MAINNET_PRIVATE_KEY
   ```
3. Update `hardhat.config.ts` to add mainnet network
4. Deploy:
   ```bash
   npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts --network mainnet
   ```
5. Verify contract on Etherscan:
   ```bash
   npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
   ```

## Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/CoffeeBatch.js

# Start local node
npx hardhat node

# Deploy to network
npx hardhat ignition deploy ignition/modules/CoffeeBatch.ts --network <network-name>

# Get contract info
npx hardhat console --network <network-name>

# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
```

## Additional Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **RainbowKit Documentation:** https://rainbowkit.com/docs
- **Magic Link Documentation:** https://magic.link/docs
- **Wagmi Documentation:** https://wagmi.sh/
- **Sepolia Faucet:** https://sepoliafaucet.com/

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review browser console for errors (F12)
3. Check Hardhat console output for deployment issues
4. Verify all environment variables are set correctly
5. Ensure you're on the correct network
6. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Network you're using
   - Browser and version

## Security Notes

- Never commit private keys to git
- Use Hardhat Keystore for secure key storage
- Keep `.env` and `.env.local` in `.gitignore`
- Use different keys for testnet and mainnet
- Audit contracts before mainnet deployment
- Test thoroughly on testnet first
- Keep dependencies updated
- Use environment-specific contract addresses

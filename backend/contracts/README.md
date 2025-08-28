# Donation NFT Contracts

## Deployment Instructions

### 1. Deploy ERBProjectNFT ✅ DEPLOYED
```solidity
// Deployed at: 0x1Fd55F2D5Bc41747274D355d051f00CCCD33b81d
ERBProjectNFT nft = new ERBProjectNFT(ADMIN_ADDRESS, 0xD8462e0A1a78E8ac07e0A414B5539680689071C8);
```

### 2. Deploy DonationContract ✅ DEPLOYED
```solidity
// Deployed at: 0xD8462e0A1a78E8ac07e0A414B5539680689071C8
DonationContract donation = new DonationContract(0x1Fd55F2D5Bc41747274D355d051f00CCCD33b81d, OWNER_ADDRESS);
```

### 3. Grant Minter Role (if needed later)
```solidity
// Grant minter role to new address
nft.grantMinterRole(NEW_MINTER_ADDRESS);
// Revoke minter role from old address
nft.revokeMinterRole(OLD_MINTER_ADDRESS);
```

### 4. Alternative: Set NFT Contract After Deployment
```solidity
// If you need to change NFT contract later
donation.setNFTContract(NEW_NFT_ADDRESS);
```

## Key Features

- **Price Feed Safety**: Validates price > 0 and data freshness (1 hour timeout)
- **Safe Withdrawal**: Uses low-level call instead of transfer
- **NFT Mint Protection**: Try-catch prevents donation failure if NFT mint fails
- **18-Decimal Precision**: All USD amounts use 18 decimal places
- **Flexible NFT Contract**: Can update NFT contract address if needed

## Environment Variables
```bash
NFT_CONTRACT_ADDRESS=0xD8462e0A1a78E8ac07e0A414B5539680689071C8  # DonationContract address
ERB_NFT_CONTRACT=0x1Fd55F2D5Bc41747274D355d051f00CCCD33b81d     # ERBProjectNFT address
```

## Deployed Contracts (Sepolia)
- **ERBProjectNFT**: `0x1Fd55F2D5Bc41747274D355d051f00CCCD33b81d`
- **DonationContract**: `0xD8462e0A1a78E8ac07e0A414B5539680689071C8`
- **Contract Owner**: `0x4D3666532127d9d9e6E13D64399c55f68BE0E402`

## Setup Infura RPC URL

### Steps to get SEPOLIA_RPC_URL:
1. Go to [infura.io](https://infura.io) and create account
2. Create new project → Select "Web3 API"
3. Go to project settings → Copy "Project ID"
4. Replace `YOUR_PROJECT_ID` with your actual Project ID:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/abc123def456...
   ```

### Alternative RPC Providers:
- **Alchemy**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
- **Public RPC**: `https://sepolia.infura.io/v3/` (rate limited)
# Rice Supply Chain dApp

A complete decentralized application (dApp) for rice supply chain management built on Solana blockchain using the Anchor framework. This system provides full traceability from rice production to final consumption.

## 🌟 Features

- **Complete Supply Chain Tracking**: Track rice from farm to consumer
- **Blockchain-based Transparency**: Immutable records on Solana
- **User-friendly Interface**: Modern React frontend with wallet integration
- **QR Code Integration**: Easy batch identification and tracking
- **Multi-actor Support**: Farmers, millers, distributors, retailers, and validators
- **Real-time Data**: Live updates from blockchain
- **Export Functionality**: CSV export for reporting

## 🏗️ Architecture

### Smart Contract (Anchor Program)
- **Chain Actors**: Manage supply chain participants
- **Production Seasons**: Track farming seasons and yields
- **Milled Rice**: Record rice processing information
- **Rice Batches**: Individual batch tracking with QR codes
- **Chain Transactions**: Transfer records between actors

### Backend API (Node.js + Express)
- RESTful API endpoints for all entities
- Solana blockchain integration
- Input validation and error handling
- Rate limiting and security features

### Frontend (React + Tailwind CSS)
- Wallet connection with multiple wallet support
- Tabbed interface for easy navigation
- Comprehensive forms for data entry
- Data tables with search, sort, and pagination
- Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Rust and Cargo
- Solana CLI tools
- Anchor CLI
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rice-supply-chain
```

2. **Install Anchor dependencies**
```bash
npm install
```

3. **Build and deploy the Anchor program**
```bash
anchor build
anchor deploy
```

4. **Setup the API server**
```bash
cd rice-supply-api
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

5. **Setup the frontend**
```bash
cd ../rice-supply-frontend
npm install
npm start
```

## 📋 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Chain Actors
- `GET /chain-actors` - List all actors
- `GET /chain-actors/:publicKey` - Get specific actor
- `POST /chain-actors` - Create new actor
- `PUT /chain-actors/:publicKey` - Update actor
- `DELETE /chain-actors/:publicKey` - Deactivate actor

#### Production Seasons
- `GET /production-seasons` - List all seasons
- `GET /production-seasons/:publicKey` - Get specific season
- `POST /production-seasons` - Create new season
- `PUT /production-seasons/:publicKey` - Update season
- `DELETE /production-seasons/:publicKey` - Mark as rejected

#### Milled Rice
- `GET /milled-rice` - List all milled rice records
- `GET /milled-rice/:publicKey` - Get specific record
- `POST /milled-rice` - Create new record
- `PUT /milled-rice/:publicKey` - Update record

#### Rice Batches
- `GET /rice-batches` - List all batches
- `GET /rice-batches/:publicKey` - Get specific batch
- `GET /rice-batches/qr/:qrCode` - Get batch by QR code
- `POST /rice-batches` - Create new batch
- `PUT /rice-batches/:publicKey` - Update batch
- `DELETE /rice-batches/:publicKey` - Mark as consumed

#### Chain Transactions
- `GET /chain-transactions` - List all transactions
- `GET /chain-transactions/:publicKey` - Get specific transaction
- `POST /chain-transactions` - Create new transaction
- `PUT /chain-transactions/:publicKey` - Update transaction
- `DELETE /chain-transactions/:publicKey` - Cancel transaction

## 🔧 Configuration

### Environment Variables

#### API Server (.env)
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=your_program_id_here
SOLANA_WALLET_PRIVATE_KEY=your_wallet_private_key_here
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📊 Data Models

### Chain Actor
```typescript
{
  publicKey: PublicKey,
  name: string,
  actorType: string[],
  farmId?: PublicKey,
  farmerId?: PublicKey,
  assignedTps: number,
  isActive: boolean,
  balance: number,
  pin: string,
  organization: 'blo' | 'buyback' | 'coop' | 'none',
  address?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Production Season
```typescript
{
  publicKey: PublicKey,
  farmerId: PublicKey,
  cropYear: string,
  processedYieldKg: number,
  variety?: string,
  plannedPractice?: string,
  plantingDate?: Date,
  irrigationPractice?: string,
  fertilizerUsed?: string,
  pesticideUsed?: string,
  harvestDate?: Date,
  totalYieldKg?: number,
  moistureContent?: number,
  carbonSmartCertified: boolean,
  validationStatus: 'pending' | 'validated' | 'rejected',
  validatorId?: PublicKey,
  createdAt: Date,
  updatedAt: Date
}
```

### Rice Batch
```typescript
{
  publicKey: PublicKey,
  qrCode: string,
  millingId?: PublicKey,
  batchWeightKg: number,
  moistureContent?: number,
  seasonId: PublicKey,
  currentHolderId?: PublicKey,
  pricePerKg?: number,
  dryingId?: PublicKey,
  validator?: PublicKey,
  status: 'forSale' | 'stock' | 'consumed',
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

- Wallet-based authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Transaction signing validation
- Public key format validation

## 🧪 Testing

### Run Anchor Tests
```bash
anchor test
```

### Run API Tests
```bash
cd rice-supply-api
npm test
```

### Run Frontend Tests
```bash
cd rice-supply-frontend
npm test
```

## 📦 Deployment

### Solana Program
1. Build the program: `anchor build`
2. Deploy to devnet: `anchor deploy`
3. Update program ID in configuration files

### API Server
Deploy to your preferred cloud provider (AWS, Heroku, etc.)

### Frontend
Deploy to Vercel, Netlify, or similar:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete supply chain tracking
- Wallet integration
- QR code support
- Export functionality

# HIVE Protocol — Deployment Guide (Monad Testnet)

This document provides step-by-step instructions for compiling, testing, and deploying the HIVE smart contracts on **Monad Testnet** using Foundry.

---

## 1. Prerequisites

1. **Foundry**: Ensure Foundry is installed:
   ```bash
   forge --version
   ```
2. **Monad Testnet Native MON**: Fund your deployer address with native MON for gas fees via the Monad faucet.
3. **RPC URL**: `https://testnet-rpc.monad.xyz` (Chain ID: `10143`).

---

## 2. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your deployment private key and RPC URL in `.env`:
```env
PRIVATE_KEY=0xYourPrivateKeyHereWithoutQuotes
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_CHAIN_ID=10143
```

> [!CAUTION]
> Never commit your real private key or upload `.env` to public repositories.

---

## 3. Build & Test

Run the full Foundry compilation and automated test suite:
```bash
# Build contracts with Solc 0.8.24 + via_ir
forge build

# Run all 32 unit, lifecycle, commit-reveal, security, and scoring tests
forge test -vvv

# Inspect gas usage
forge test --gas-report
```

---

## 4. Deploying to Monad Testnet

Deploy `HiveArena` and `HivePulse` using the deployment script `script/Deploy.s.sol`:

```bash
forge script script/Deploy.s.sol \
  --rpc-url $MONAD_TESTNET_RPC_URL \
  --broadcast \
  --legacy
```

*(Note: Use `--legacy` if the testnet node requires legacy gas pricing).*

---

## 5. Saving Contract Addresses

After deployment, update `.env` and `docs/FRONTEND_BLOCKCHAIN_INTEGRATION.md` with the deployed addresses output by the script:
```env
HIVE_ARENA_ADDRESS=0x...
HIVE_PULSE_ADDRESS=0x...
```

---

## 6. Exporting ABIs for Frontend Integration

Foundry outputs compiled contract artifacts and ABIs in `out/`:
- `out/HiveArena.sol/HiveArena.json`
- `out/HivePulse.sol/HivePulse.json`
- `out/IHiveArena.sol/IHiveArena.json`
- `out/IHivePulse.sol/IHivePulse.json`

To extract clean ABI files for frontend teammates (`viem`/`wagmi`):
```bash
# PowerShell
(Get-Content out/HiveArena.sol/HiveArena.json | ConvertFrom-Json).abi | ConvertTo-Json -Depth 10 > src/domain/abi/HiveArena.json
(Get-Content out/HivePulse.sol/HivePulse.json | ConvertFrom-Json).abi | ConvertTo-Json -Depth 10 > src/domain/abi/HivePulse.json
```

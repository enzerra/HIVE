# HIVE Frontend Blockchain Integration Guide (viem + wagmi)

This guide provides frontend engineers with the exact specifications, types, ABI interfaces, and code examples needed to connect the HIVE Next.js web application to the Monad Testnet smart contracts.

---

## 1. Network Configuration

Add Monad Testnet to your `viem` / `wagmi` chain definition:

```typescript
import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadExplorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
});
```

---

## 2. Contract Addresses & ABIs

| Contract | Address (Monad Testnet) | ABI Location |
| :--- | :--- | :--- |
| **HiveArena** | `0x0000000000000000000000000000000000000000` *(Placeholder)* | `out/HiveArena.sol/HiveArena.json` |
| **HivePulse** | `0x0000000000000000000000000000000000000000` *(Placeholder)* | `out/HivePulse.sol/HivePulse.json` |

---

## 3. Cryptographic Commit-Reveal Scheme

A player's private choice ($A$ or $B$) is hidden on-chain during `Commit` and verified in `Reveal`.

### 3.1 Choice & Stage Enums
```typescript
export enum Choice {
  None = 0,
  A = 1,
  B = 2,
}

export enum Stage {
  Initial = 0,
  Final = 1,
}
```

### 3.2 Generating Salt & Commitment in Frontend (TypeScript with `viem`)
```typescript
import { encodeAbiParameters, keccak256, toHex } from 'viem';

/**
 * Generate a cryptographically secure 256-bit salt.
 * NEVER use block.timestamp or Math.random().
 */
export function generateSalt(): `0x${string}` {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return toHex(randomBytes);
}

/**
 * Compute the commitment hash matching HiveArena.computeCommitmentHash
 */
export function computeCommitmentHash(
  matchId: `0x${string}`,
  roundId: number,
  playerAddress: `0x${string}`,
  stage: Stage,
  choice: Choice,
  salt: `0x${string}`
): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { name: 'matchId', type: 'bytes32' },
      { name: 'roundId', type: 'uint8' },
      { name: 'player', type: 'address' },
      { name: 'stage', type: 'uint8' },
      { name: 'choice', type: 'uint8' },
      { name: 'salt', type: 'bytes32' },
    ],
    [matchId, roundId, playerAddress, stage, choice, salt]
  );
  return keccak256(encoded);
}
```

---

## 4. Transaction Lifecycle & Receipts

The UI distinguishes three operational stages for submissions:
1. `service_accepted`: The user clicked submit; the frontend gateway acknowledged receipt intent.
2. `chain_submitted`: Transaction has been broadcast to Monad Testnet and is pending inclusion.
3. `canonical_locked`: Transaction was included in a block and the `CommitmentSubmitted` or `ChoiceRevealed` event was emitted.
4. `failed`: Transaction reverted or phase deadline passed before inclusion.

### 4.1 Submitting Commitment
```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { HiveArenaAbi } from './abi/HiveArena';

export function useSubmitCommitment() {
  const { writeContractAsync, data: hash } = useWriteContract();

  const submit = async (
    matchId: `0x${string}`,
    roundId: number,
    stage: Stage,
    commitmentHash: `0x${string}`
  ) => {
    return await writeContractAsync({
      address: HIVE_ARENA_ADDRESS,
      abi: HiveArenaAbi,
      functionName: 'commitChoice',
      args: [matchId, roundId, stage, commitmentHash],
    });
  };

  return { submit, hash };
}
```

### 4.2 Revealing Choice
```typescript
export function useRevealChoice() {
  const { writeContractAsync } = useWriteContract();

  const reveal = async (
    matchId: `0x${string}`,
    roundId: number,
    stage: Stage,
    choice: Choice,
    salt: `0x${string}`
  ) => {
    return await writeContractAsync({
      address: HIVE_ARENA_ADDRESS,
      abi: HiveArenaAbi,
      functionName: 'revealChoice',
      args: [matchId, roundId, stage, choice, salt],
    });
  };

  return { reveal };
}
```

### 4.3 Submitting Revision (Stay / Switch)
```typescript
export enum AttributionKind {
  None = 0,
  OtherSquadArgument = 1,
  InternalDiscussion = 2,
  NewEvidence = 3,
  OwnReconsideration = 4,
  Undisclosed = 5,
}

export function useSubmitRevision() {
  const { writeContractAsync } = useWriteContract();

  const revise = async (
    matchId: `0x${string}`,
    roundId: number,
    isStay: boolean,
    attribution: AttributionKind,
    cardId: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000000'
  ) => {
    return await writeContractAsync({
      address: HIVE_ARENA_ADDRESS,
      abi: HiveArenaAbi,
      functionName: 'submitRevision',
      args: [matchId, roundId, isStay, attribution, cardId],
    });
  };

  return { revise };
}
```

---

## 5. Event Listeners

Frontend components should listen to contract events to keep UI states synchronized:

```typescript
import { useWatchContractEvent } from 'wagmi';
import { HiveArenaAbi } from './abi/HiveArena';

export function useArenaEvents(matchId: `0x${string}`) {
  // Phase changes
  useWatchContractEvent({
    address: HIVE_ARENA_ADDRESS,
    abi: HiveArenaAbi,
    eventName: 'PhaseAdvanced',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.matchId === matchId) {
          console.log('Phase advanced to:', log.args.newPhase, 'Deadline:', log.args.deadline);
        }
      }
    },
  });

  // Round resolved
  useWatchContractEvent({
    address: HIVE_ARENA_ADDRESS,
    abi: HiveArenaAbi,
    eventName: 'RoundResolved',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.matchId === matchId) {
          console.log('Round resolved:', log.args.roundId, 'Outcome:', log.args.outcome);
        }
      }
    },
  });
}
```

---

## 6. Phase Mapping Matrix

| Contract Phase Enum | Phase Name | UI State / Actions Available |
| :---: | :--- | :--- |
| `0` | **Think** | Read evidence, deliberate independently. No commits. |
| `1` | **Deliberate** | Squad private chat open. Representative drafts & commits argument hash. |
| `2` | **Commit** | Submit choice commitment. Chat read-only. |
| `3` | **Reveal** | Submit reveal (choice + salt). Initial batch aggregate displays once tallies close. |
| `4` | **Council** | View frozen argument cards from own Hive's squads. Deliberate within Squad. |
| `5` | **Revision** | Submit Stay or Switch with attribution kind. |
| `6` | **Resolve** | Buffer finalization. Await real-world outcome. Next round starts when ready. |

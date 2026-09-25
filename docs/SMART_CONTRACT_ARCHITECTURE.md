# HIVE Smart Contract Architecture (Monad Testnet)

## 1. Executive Summary & Philosophy

HIVE is a competitive social prediction protocol where human communities test their collective judgment through structured perspective-sharing. Rather than financialized wagering or speculative token mechanics, HIVE anchors community alignment, epistemic deliberation, and consensus formation into verifiable cryptographic state.

The smart contract layer acts as a **trust-minimized verification and settlement anchor** on the **Monad Testnet**.
- **Target Network:** Monad Testnet (EVM-compatible, high throughput, low latency).
- **Zero Financialization:** No custom ERC-20 tokens, no NFTs, no staking pools, and no betting mechanisms.
- **Minimal On-Chain Footprint:** Only state transitions, cryptographic commitments, reveals, Stay/Switch decisions, and canonical outcome proofs are settled on-chain. Social interaction (chat, arguments, isometric world rendering) remains off-chain.

---

## 2. PRD Requirement → Smart Contract Mapping

| PRD Section | Requirement Description | Smart Contract Implementation | Location |
| :--- | :--- | :--- | :--- |
| **PRD §3** | Two Hives (e.g., Purple vs Chog) with equal Squads (3 or 5), 3–5 Humans per Squad. | Roster hash anchoring, immutable membership tracking per Hive & Squad during match lock. | `HiveArena.sol` |
| **PRD §5.1** | 7-phase round timeline: Think (20s) → Deliberate (60s) → Commit (15s) → Reveal (10s) → Council (60s) → Revision (20s) → Resolve (5s buffer). | Authoritative phase clock via `block.timestamp` and phase state transitions with strict deadline enforcement. | `HiveArena.sol` |
| **PRD §5.1** | Information barrier: private choices before reveal; Squad argument frozen during Deliberate. | Cryptographic commit-reveal scheme (`keccak256`) for choices; argument hash committed on-chain. | `HiveArena.sol` |
| **PRD §5.2** | Canonical quadratic scoring: $100 \times (1 - (p - y)^2)$ with $S = 10^6$, integer micro-point arithmetic. | Pure Solidity library `HiveScoring.sol` using exact integer arithmetic matching `src/domain/rules.ts`. | `HiveScoring.sol` |
| **PRD §5.2** | Wisdom Lift calculation: $100 \times (|p_{init} - y| - |p_{final} - y|)$ in signed micro-pp. | Signed integer math in `HiveScoring.sol`. | `HiveScoring.sol` |
| **PRD §5.2** | 3-round matches; outcome valid on $\ge 2$ rounds for ranked result; tie results in draw; $< 2$ valid results in no contest. | Multi-round aggregation and match settlement logic enforcing $\ge 2$ valid round constraint. | `HiveArena.sol` |
| **PRD §5.3** | Anti-forfeit / default rules: missing initial commit/reveal causes Hive forfeit; missing final commit defaults to Stay; final commit without reveal causes forfeit. | Explicit branching in reveal and resolution logic enforcing forfeiture vs defaulted Stay. | `HiveArena.sol` |
| **PRD §6 / Domain**| Quick Pulse standalone open prediction: initial lock before crowd disclosure, discussion period, Stay/Switch revision, outcome resolve, and void handling. | Dedicated lightweight `HivePulse.sol` contract supporting single-prediction commit-reveal and revisions. | `HivePulse.sol` |

---

## 3. On-Chain vs. Off-Chain Responsibilities

```text
┌─────────────────────────────────────────────────────────────┐
│                       ON-CHAIN (EVM)                        │
│ - Match registry, Roster Hash, Rules Hash                   │
│ - Phase state transitions & timestamp deadlines             │
│ - Commitments (initial & final choice hashes)               │
│ - Argument content hashes (keccak256 of frozen text)        │
│ - Cryptographic reveal verification (choice + salt)         │
│ - Stay / Switch revision status                             │
│ - Forfeit & defaulted Stay detection                        │
│ - Verified outcome recording (A, B, Void)                   │
│ - Canonical Brier quadratic scoring & Wisdom Lift           │
│ - Final match settlement (Win, Draw, No Contest)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ State / Events / Receipts
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     OFF-CHAIN / GATEWAY                     │
│ - Squad chat messages & real-time messaging                 │
│ - Full plaintext argument editing & storage                 │
│ - Isometric HIVE World & Living Belief Field rendering      │
│ - Local presentation countdown timers                       │
│ - Steam API polling & real-world evidence gathering         │
│ - User profiles, avatars, handles, social graph             │
│ - Public replay bundle assembly & sharing                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Contract Architecture

The system is organized into modular, gas-efficient contracts and libraries:

```text
contracts/
├── interfaces/
│   ├── IHiveArena.sol        // Arena contract interface
│   └── IHivePulse.sol        // Quick Pulse contract interface
├── libraries/
│   ├── HiveTypes.sol         // Enums, structs, custom errors, events
│   └── HiveScoring.sol       // Pure integer arithmetic for belief and scoring
├── HiveArena.sol             // 3-Round 2-Hive community match engine
└── HivePulse.sol             // Standalone Quick Pulse prediction primitive
```

### 4.1 `HiveArena.sol`
Manages the complete lifecycle of competitive 3-round matches between two Hives:
- **Registration & Lobby:** Organizers create matches with fixed rosters and rule hashes.
- **Roster Lock:** Match becomes immutable before play begins.
- **Rounds (1 to 3):** Advances through 7 distinct phases per round.
- **Commit & Reveal:** Enforces private choices during `Commit`, verified in `Reveal`.
- **Revision (Stay/Switch):** Permits players to stay or flip their choice with attribution during `Revision`.
- **Resolution & Scoring:** Authorized resolver posts real-world outcome; contract calculates Hive scores and Wisdom Lift.
- **Match Settlement:** Computes cumulative scores across all rounds and awards win/draw/no-contest.

### 4.2 `HivePulse.sol`
Manages standalone Quick Pulse calls:
- Fast community predictions (e.g., Steam relative player growth).
- Initial choice lock before crowd distribution disclosure.
- Revision window (Stay/Switch).
- Resolver settlement or safe voiding.

### 4.3 `HiveScoring.sol`
Implements the exact integer arithmetic specified in `src/domain/rules.ts`:
- Scale factor: $S = 1\,000\,000$ ($10^6$).
- Squad belief: $P_{squad} = \lfloor \frac{A_{count} \times S}{rosterSize} \rfloor$.
- Hive belief: $P_{hive} = \lfloor \frac{\sum P_{squad}}{squadCount} \rfloor$.
- Quadratic score: $Score = \lfloor \frac{100 \times S \times (S^2 - d^2)}{S^2} \rfloor$, where $d = |P_{hive} - y \times S|$.
- Wisdom Lift: $Lift = 100 \times (|P_{initial} - y \times S| - |P_{final} - y \times S|)$.

---

## 5. State Machine

### 5.1 Match Lifecycle
```text
Draft ──► Lobby ──► Locked ──► Running ──► AwaitingOutcomes ──► Settled
  │                   │                                            ▲
  └────────► Cancelled └────────────────────────► NoContest ───────┘
```

### 5.2 Round Phase Lifecycle (Per Round)
```text
[0s] Think (20s)
  │  (Deliberation without chat or choice disclosure)
  ▼
[20s] Deliberate (60s)
  │   (Squad chat active; Representative prepares argument)
  ▼
[80s] Commit (15s)
  │   (Players submit choice commitments; Rep commits argument hash)
  ▼
[95s] Reveal (10s)
  │   (Players reveal initial choice + salt; contract tallies initial belief)
  ▼
[105s] Council (60s)
  │    (Cross-squad argument cards visible within Hive)
  ▼
[165s] Revision (20s)
  │    (Players submit Stay or Switch with attribution)
  ▼
[185s] Resolve / Finalizing (5s buffer)
  │    (Final reveals tallied; round awaits real-world outcome)
  ▼
Awaiting Outcome / Resolved
  │    (Resolver submits outcome A, B, or Void; scores computed)
  ▼
Next Round (R2, R3) or Final Match Settlement
```

---

## 6. Data Structures & Types

### 6.1 Enums
```solidity
enum Choice { None, A, B }
enum Phase { Think, Deliberate, Commit, Reveal, Council, Revision, Resolve }
enum MatchStatus { Draft, Lobby, Locked, Running, AwaitingOutcomes, Settled, Void, NoContest }
enum Stage { Initial, Final }
enum AttributionKind { Undisclosed, OtherSquadArgument, InternalDiscussion, NewEvidence, OwnReconsideration }
```

### 6.2 Key Structs
```solidity
struct PlayerCommitment {
    bytes32 initialCommitment;
    bytes32 finalCommitment;
    Choice initialChoice;
    Choice finalChoice;
    bool initialRevealed;
    bool finalRevealed;
    bool isStay;
    AttributionKind attribution;
    bytes32 attributionCardId;
}

struct RoundState {
    Phase currentPhase;
    uint256 phaseDeadline;
    bytes32 argumentHashPurple;
    bytes32 argumentHashChog;
    Choice outcome;
    bool outcomeResolved;
    bool isVoid;
    uint256 purpleInitialBelief;
    uint256 purpleFinalBelief;
    uint256 chogInitialBelief;
    uint256 chogFinalBelief;
    uint256 purpleScore;
    uint256 chogScore;
    int256 purpleWisdomLift;
    int256 chogWisdomLift;
    bool purpleForfeit;
    bool chogForfeit;
}
```

---

## 7. Events

Events are indexed to enable clean subgraphs, viem/wagmi event polling, and gateway receipt reconciliation:
- `MatchCreated(bytes32 indexed matchId, address indexed creator, bytes32 rosterHash, bytes32 rulesHash)`
- `MatchLocked(bytes32 indexed matchId, uint256 timestamp)`
- `MatchStarted(bytes32 indexed matchId, uint256 timestamp)`
- `PhaseAdvanced(bytes32 indexed matchId, uint8 indexed roundId, Phase newPhase, uint256 deadline)`
- `CommitmentSubmitted(bytes32 indexed matchId, uint8 indexed roundId, address indexed player, Stage stage, bytes32 commitmentHash)`
- `ChoiceRevealed(bytes32 indexed matchId, uint8 indexed roundId, address indexed player, Stage stage, Choice choice)`
- `RevisionSubmitted(bytes32 indexed matchId, uint8 indexed roundId, address indexed player, bool isStay, AttributionKind attribution)`
- `ArgumentCommitted(bytes32 indexed matchId, uint8 indexed roundId, uint8 indexed hiveId, bytes32 argumentHash)`
- `RoundResolved(bytes32 indexed matchId, uint8 indexed roundId, Choice outcome, uint256 purpleScore, uint256 chogScore)`
- `MatchSettled(bytes32 indexed matchId, uint8 winnerHive, uint256 purpleTotalScore, uint256 chogTotalScore, bool isDraw, bool isNoContest)`
- `MatchVoided(bytes32 indexed matchId, string reason)`

---

## 8. Security & Trust Assumptions

### 8.1 Front-Running & Information Leakage
- **Cryptographic Commitments:** A player's choice is committed via `keccak256(abi.encode(matchId, roundId, msg.sender, stage, choice, salt))` where `salt` is a cryptographically secure 256-bit random value.
- **Timing Barriers:** The contract strictly rejects any `revealChoice` transaction submitted before the `Reveal` or `Resolve` phase has officially begun.
- **Roster Binding:** Commitments include `msg.sender` in the hash preimage, preventing replay or front-running of another player's commitment.

### 8.2 Denial-of-Service & Gas Griefing
- Fixed roster sizes ($\le 5$ squads per Hive, $\le 5$ players per squad $\implies \le 50$ players per match).
- Bounded loops ensure gas consumption per transaction is strictly under 150,000 gas on Monad.
- O(1) mappings used for player lookups and state transitions.

### 8.3 Timestamp Manipulation
- Relies on `block.timestamp`. On Monad, block times are sub-second with strict validator consensus boundaries.
- Phase durations are $\ge 5$ seconds (baseline 10–60s), ensuring minor validator timestamp variations ($< 1$ second) cannot prematurely close or exploit phases.

---

## 9. Frontend Integration Requirements (viem / wagmi)

- **RPC Target:** Monad Testnet RPC (`https://testnet-rpc.monad.xyz`).
- **Chain ID:** `10143` (Monad Testnet).
- **Idempotency Reconciliation:** The frontend generates an `idempotencyKey` client-side. When submitting a commit tx, the UI displays `service_accepted` $\to$ `chain_submitted` $\to$ `canonical_locked` once the receipt/event is confirmed.
- **Off-Chain Salt Storage:** The frontend or secure session keeper must keep the `salt` in local memory until the `Reveal` phase window opens, then submit `reveal(choice, salt)`.

---

## 10. Known Limitations & Trust Boundary

1. **Outcome Source:** Real-world outcomes (e.g., Steam relative growth) rely on an authorized `RESOLVER_ROLE` or oracle. The contract guarantees transparent, immutable scoring given that outcome, but does not autonomously scrape Steam.
2. **Social Secrecy:** The blockchain guarantees on-chain choices cannot be decrypted prior to reveal. However, it cannot prevent players from communicating via out-of-band channels (e.g., Discord) or colluding off-chain.
3. **Storage vs. Historical Proofs:** Full arguments and chat logs are stored off-chain; the blockchain anchors their cryptographic commitments (`keccak256`), providing tamper-evident verification.

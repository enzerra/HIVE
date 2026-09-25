# HIVE Trust Model & Security Boundaries

## 1. Philosophy: No Fake Decentralization

Web3 games often claim to be "fully decentralized" while relying on centralized AWS backends to decide game outcomes or manipulate scores. 

HIVE adopts an **honest, transparent security and trust architecture**. This document explicitly demarcates what the Monad smart contracts guarantee trustlessly versus what relies on off-chain servers, operators, or resolvers.

---

## 2. What Does the Blockchain Guarantee?

1. **Commitment Integrity:**
   - A player's choice cannot be altered once their cryptographic commitment hash is mined on-chain.
   - Nobody (including miners, validators, operators, and the HIVE team) can read the player's committed choice before the `Reveal` phase, provided the player generates a high-entropy salt.
2. **Immutable Roster & Rules:**
   - Once a match is locked (`lockMatch`), the roster and rules hash are frozen. The operator cannot swap players, inject sybil votes, or change rule versions midway through the match.
3. **Canonical Scoring & Settlement:**
   - The contract independently computes the quadratic Brier score, Squad/Hive belief percentages, Wisdom Lift, and match winner using exact pure integer arithmetic.
   - The operator cannot tamper with scores, arbitrarily award victory to a favored Hive, or override a draw/no-contest settlement.
4. **Strict Phase Deadlines:**
   - Deadlines are anchored to `block.timestamp`. Transactions submitted after a deadline revert automatically at the EVM level.
5. **Anti-Forfeit Enforcement:**
   - If a player fails to submit their initial reveal, the smart contract automatically registers a forfeit for their Hive.
   - If a player fails to submit a final revision, the contract automatically defaults them to `Stay` without allowing retro-active choice switching.

---

## 3. What Does the Server / Operator Still Control?

1. **External Outcome Reporting (The Oracle / Resolver):**
   - The smart contract does not natively poll the Steam Web API to fetch concurrent player numbers.
   - An authorized `RESOLVER` role is trusted to submit the ground-truth outcome ($A$, $B$, or $Void$) for each round.
   - *Mitigation:* The contract requires the resolver to be explicitly declared at match creation. Multiple observers can independently verify Steam data against the submitted outcome hash.
2. **Phase Advancement Triggering:**
   - While phase deadlines are strictly enforced, moving the contract state to the next phase requires a transaction (`advancePhase`).
   - Anyone can trigger `advancePhase` once the deadline passes; the operator can also trigger it earlier if all participants have completed their actions.
3. **Chat & Off-Chain Discussion:**
   - Squad private chat, reactions, and argument text drafts are stored off-chain on application servers.
   - The server is trusted not to leak Squad deliberation chat to rival Squads during the `Deliberate` phase.
4. **Account & Social Identity:**
   - Google authentication, Discord linkage, user avatars, handles, and profile metadata are maintained off-chain.
   - The on-chain layer only knows the Ethereum/Monad addresses assigned to the roster.

---

## 4. Threat Analysis

### 4.1 What Can a Malicious Player Do?
- **Try to front-run another player's commitment?** 
  *Prevented:* The commitment hash pre-image includes `msg.sender`. Copying another player's commitment transaction from the mempool will result in an `InvalidReveal()` revert.
- **Try to change their choice after seeing others' reveals?**
  *Prevented:* Changing the choice invalidates the `keccak256` hash check, causing `revealChoice()` to revert.
- **Try to submit late actions?**
  *Prevented:* The contract checks `block.timestamp <= phaseDeadline` and reverts with `LateSubmission()`.
- **Try to sabotage their Squad by not revealing?**
  *Possible:* If a rostered player refuses to submit their initial reveal, their Hive suffers a round forfeit. Squad curation and reputation mechanics exist off-chain to disincentivize griefing.

### 4.2 What Can a Malicious Operator Do?
- **Can the operator change a player's vote?** 
  *No.* The operator has no private keys for players and cannot forge reveals.
- **Can the operator change the winner?**
  *No.* The contract calculates the winner strictly based on canonical scores and valid rounds.
- **Can the operator submit a false real-world outcome?**
  *Yes, if the operator also holds the `RESOLVER` role.* If an operator lies about who won a Steam concurrent player growth race, the contract will calculate scores based on that false outcome.
  *Future mitigation:* Transition from single-resolver to a decentralized UMA/Chainlink optimistic oracle or multi-sig consensus.

### 4.3 What Can a Malicious Frontend Do?
- A compromised client could fail to submit a user's transaction or reveal the salt to an external party before the Reveal phase.
- *Mitigation:* Players can verify all on-chain transactions directly on the Monad block explorer using independent wallet clients (e.g. MetaMask, Rabby).

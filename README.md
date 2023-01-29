# Generic Staking DApp on Celo

- Backend
  - Stacks
    - Foundry
    - Solidity

For full understanding of the backend, follow **[this tutorial]()**

- Frontend
  - Stacks
    - React
    - NextJs
    - MaterialUi
    - etherJs
    - We3Js

**How to run**
> Note : Be sure to have metamask browser extension installed in  your browser.

```bash
git clone https://github.com/bobeu/stakingdapp-on-celo/
```

```bash
cd stakingdapp-on-celo/frontend
```

```bash
yarn install
```

```bash
yarn run dev
```

- Demo
**[Click to interact with Dapp]()**

# Compile contracts
```bash
forge build
```

# Test contracts
```bash
forge test
```

# Deployment information
- Vault.sol

Command
```bash 
forge create --rpc-url https://alfajores-forno.celo-testnet.org --constructor-args 10000000000000000000 2 --private-key <paste your private key here> src/Vault.sol:Vault
```
Output
```bash
[⠢] Compiling 2 files with 0.8.17
[⠰] Solc 0.8.17 finished in 3.04s
Compiler run successful
Deployer: 0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669
Vault Deployed to: 0x61FF31ec3bfbB8963B8180C845BAf57e5808deCF
Transaction hash: 0xe4dd50d71f47ec7c6dd5bf51163b57cb69b90aedb103ac891f18b19153175d9f
```

- RewardToken.sol

Command
```bash 
forge create --rpc-url https://alfajores-forno.celo-testnet.org --constructor-args 10000000000000000000 2 --private-key <paste your private key here> src/Vault.sol:Vault
```
Output
```bash
[⠔] Compiling 1 files with 0.8.17
[⠃] Solc 0.8.17 finished in 4.67s
Compiler run successful
Deployer: 0x85AbBd0605F9C725a1af6CA4Fb1fD4dC14dBD669
Token Deployed to: 0xb8e492D15471214Ba021bB53D07f4bCB40DCD235
Transaction hash: 0x6491f086afc4218d0e65080cf17b49f1cd0713281bd8174e1046234a770f54ba
```
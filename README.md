# Git DAO

### What is it?

1. Sign in with GitHub to see a list of repos the user has access to
2. A backend service creates a hash and signature after verifying user has in fact access
3. Send repo to smart contract which verifies signature and creates a project
4. An ERC20 token with 1M supply is created and mints 10k to owner (1% of all tokens)
5. The owner can optionally supply their tokens to Uniswap with ETH to create initial market
6. People can participate by contributing with code, bug reports or other ways to create value to the project and be rewarded in tokens for their work.
7. People or companies can fund the project or even specific issues to help with prioritization

This token will initially have 0 value but the creator can create an initial funding of the project themselves by providing tokens + ETH to an AMM like Uniswap. A market is then created around the token and contributors who have been rewarded can swap their tokens to ETH if they choose to (and speculators can buy tokens for ETH).

People who are interested in the project can fund it by simply sending tokens to it. A vesting wallets with 365 days linear vesting is created to prevent the owner from withdrawing all at once.

Vision for this project is:

- Existing popular open-source projects can find funding
- Stakeholders can incentivize prioritization of features and bug fixes by funding issues or milestones
- New ideas can be formulated in a readme-driven way of development and attracting contributors who are rewarded by their participation.
- DAOs naturally forming around open-source repos
- By combining code as an underlying asset with a token and funding, liquidity could be provided to an AMM to create a market around the project.

By utilizing GitHubs platform for Issues, PRs, Discussion and code repository and merely adding a layer of smart contracts we can get the best of web2 and web3 and working on incremental decentralization.

### Future work

- BountyRegistry to fund specific issues
  - Backend service to verify GitHub session with connected account and PR merge status - returns a signature
  - Claim function to verify signature and transfer funds to contributor
- LiquidityProvider
  - Provide liquidity to an AMM (Uniswap for example)
  - Zap function to swap an optimal one-sided supply when providing ETH
- Governance

### Screenshots

![](https://github.com/carlbarrdahl/git-dao/raw/master/.screenshots/onboard_1.png)
![](https://github.com/carlbarrdahl/git-dao/raw/master/.screenshots/onboard_2.png)
![](https://github.com/carlbarrdahl/git-dao/raw/master/.screenshots/project_1.png)

This project is being built to bootstrap itself using this idea.

If you want to participate in any way please join the https://github.com/carlbarrdahl/git-dao/discussions!

---

Inspired by Balaji Srinivasan's Tweet:  
https://twitter.com/balajis/status/1326313315044192256?lang=en

Also mentioned in:  
DappCamp X Balaji Srinivasan - Open Problems in Crypto Infrastructure  
https://www.youtube.com/watch?v=l2VQkbucXns

Madhavan Malolan's LaunchDAO:
https://mirror.xyz/madhavanmalolan.eth/OMGH_SQ9E97r2-iXzY2ndQQgOuTUXdVaM-VBoiT0mIg

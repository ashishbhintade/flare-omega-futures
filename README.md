# Omega Futures

Trade any commodity you like, from potatoes to butter, with ease. Built using Flare FDC, Hardhat, and Next.js on the Flare Coston 2 Testnet.

## Smart Contract

You can check the smart contract here: [https://github.com/ashishbhintade/flare-futures-contract](https://github.com/ashishbhintade/flare-futures-contract)

## Live Demo

You can try the live demo here: [https://flare-omega-futures.vercel.app/](https://flare-omega-futures.vercel.app/)

## Run the Project Locally

Start by cloning the repository with this command:

```bash
git clone https://github.com/ashishbhintade/flare-omega-futures.git
```

### Next.js App

To run the Next.js app locally, first install the dependencies:

```bash
yarn
```

Then start the app:

```bash
yarn dev
```

## Architecture

The application has three main parts:

- User
- Bot (which sends updates to the contract through FDC)
- Contract

### Interaction with the Contract

The following diagram shows how users and the bot interact with the contract:

![Diagram showing which functions users and the bot interact with](./public/contract-interaction.png)

### User Interaction

Here is more detail about how users interact with the contract and what each function does:

![Diagram showing which contract functions users can use and what they are for](./public/user-interaction.png)

### Full Contract Flow

The diagram below shows the full flow of how the user, bot, and contract interact step-by-step:

![Diagram showing interaction between every entity](./public/full-flow.png)

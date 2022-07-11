# Pro Stakers

This is a sample stake contract project

## Technologies:

React, Nest JS, Solidity

## Getting started

### Setup Project

Commands:

```bash
$ npm run setup
```

This command will install the dependencies for all projects including `hardhat project`, `react-app` and `nest-app`.

### Compile the Contract

```
$ hardhat compile
```

### Run apps

Commands:

```bash
$ npm start

```

This command will run `react-app` and `nest-app` in the same terminal concurrently in development mode.

## Hardhat Project

Hardhat project contains the ProStakers contract.
It also has means to deploy the contract on Rinkeby testnet.

Commands:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## React App

The React-App is on `react-app` folder.

### Features

React app has an interface to deposit and withdraw from the contract
It also fetches the stored events from nest-app.

> **Notes:** The app is pointing to a deployed contract on rinkeby network.
> To update the contract address you must update the address on `react-app/src/contract/proStakers.json`,
> because I didn't setup any env file yet.

Scripts:

```bash
$ npm run dev
```

## Nest.js Backend

Nest.js Backend is located on `nest-app` folder.

### Events Module

#### WebSocket Client

The WebSocket client is a client to listen to the ProStakers contract events.
It calls EventsServices when it listens to the events.

#### Controller

* Index
    * Endpoint: "/events?address=<ADDRESS_HERE>&type=<EVENT_TYPE>"
    * Method: "GET"

#### Service

* Methods
    * Create
    * FindEvents

> **Notes:** The nest-app is pointing to a deployed contract on rinkeby network.
> To update the contract address you must update the address on `nest-app/src/events/socket-client.ts` file.

## TODO

I think the overall project is ok, but I could make some things better, these are the things I'd like to do next.

* Setup environment variables properly.
* ReactApp:
    * Deal with the loading state;
    * Validate the form values;
    * Create tabs to render Deposit and Withdraw conditionally;
    * Refactor the App.tsx file into components;
    * Refactor the signing logic into a custom hook;
    * Add address and EventType filters to the table.
    * Add cool styles with themes.
* NestJS:
    * Paginate the getEvents request.


import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      // This value will be replaced on runtime
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.STAGING_ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

export default config;

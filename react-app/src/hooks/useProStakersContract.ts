import { useContext } from "react";
import { ProStakersContext } from "../contexts/ProStakersContext";

export const useProStakersContract = () => {
  const context = useContext(ProStakersContext);

  if (!context) {
    throw new Error("useWave must be within a WaveProvider!");
  }

  return context;
};

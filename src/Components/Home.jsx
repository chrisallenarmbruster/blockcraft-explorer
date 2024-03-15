import React from "react";
import BlockchainInfo from "./BlockchainInfo";
import BlockchainIntegrity from "./BlockchainIntegrity";

const Home = () => {
  return (
    <div>
      <h2 className="h3">Blockchain Info</h2>
      <BlockchainInfo />
      <h2 className="h3 mt-3">Blockchain Integrity</h2>
      <BlockchainIntegrity />
    </div>
  );
};

export default Home;

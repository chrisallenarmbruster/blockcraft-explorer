import React, { useState, useEffect } from "react";
import BlockchainIntegrity from "./BlockchainIntegrity";

function ChainIntegrityChecker() {
  return (
    <div>
      <h2 className="h3">Chain Integrity Checker</h2>
      <BlockchainIntegrity />
    </div>
  );
}

export default ChainIntegrityChecker;

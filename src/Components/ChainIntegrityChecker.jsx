import React, { useState, useEffect } from "react";

function ChainIntegrityChecker() {
  const [chainIntegrity, setChainIntegrity] = useState({
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    async function fetchChainIntegrity() {
      try {
        const response = await fetch("/api/chain-integrity");
        console.log("response", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);
        setChainIntegrity({ isLoading: false, data, error: null });
      } catch (error) {
        setChainIntegrity({
          isLoading: false,
          data: null,
          error: error.message,
        });
      }
    }

    fetchChainIntegrity();
  }, []);

  return (
    <div>
      <h2>Chain Integrity Check</h2>
      {chainIntegrity.isLoading ? (
        <p>Loading...</p>
      ) : chainIntegrity.error ? (
        <p>Error: {chainIntegrity.error}</p>
      ) : (
        <pre>{JSON.stringify(chainIntegrity.data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ChainIntegrityChecker;

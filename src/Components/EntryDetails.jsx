import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const EntryDetails = () => {
  const location = useLocation();
  const entry = location.state;
  console.log(entry);

  if (!entry) {
    return <p>No entry data available.</p>;
  }

  return (
    <div>
      <h2 className="h3 mb-4">Entry Details</h2>
      <p>ID: {entry.entryId}</p>
      <p>
        Block Index:{" "}
        {entry.blockIndex === "pending" ? (
          "pending"
        ) : (
          <Link to={`/blocks/${entry.blockIndex}`}>{entry.blockIndex}</Link>
        )}
      </p>
      <p>
        Data:<br></br>
        {entry.data}
      </p>
    </div>
  );
};

export default EntryDetails;

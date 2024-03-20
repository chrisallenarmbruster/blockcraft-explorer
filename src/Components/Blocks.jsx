import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks, resetError } from "../store/blocksSlice"; // Adjust the import path as needed

const Blocks = () => {
  const dispatch = useDispatch();
  const {
    blocks,
    isLoading,
    sort,
    lastFetchedIndex,
    nextIndexReference,
    error,
  } = useSelector((state) => state.blocks);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!blocks.length && !isLoading) {
      dispatch(fetchBlocks({ sort: "asc" }));
    }
  }, [dispatch, blocks.length]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100;
      const nearTop = window.scrollY <= 100;
      if (
        (nearBottom && sort === "asc") ||
        (nearTop && nextIndexReference && sort === "asc")
      ) {
        if (!isFetching) {
          setIsFetching(true);
          fetchMoreBlocks();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, sort]);

  const fetchMoreBlocks = () => {
    dispatch(
      fetchBlocks({
        startWithIndex: lastFetchedIndex + 1,
        sort,
        limit: 10,
      })
    ).finally(() => setIsFetching(false));
  };

  const switchSortOrder = () => {
    const newSortOrder = sort === "asc" ? "desc" : "asc";
    dispatch(fetchBlocks({ sort: newSortOrder }));
  };

  return (
    <div>
      <button onClick={switchSortOrder}>
        Switch Sort Order (Current: {sort.toUpperCase()})
      </button>
      {error && <p>Error fetching blocks: {error} </p>}
      <ul>
        {blocks.map((block, index) => (
          <li key={index}>
            Block {block.index}: {block.hash}
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Blocks;

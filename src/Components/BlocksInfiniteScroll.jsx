import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlocks } from "../store/blocksSlice";

const InfiniteScrollBlocks = () => {
  const dispatch = useDispatch();
  const { blocks, isLoading, nextIndexReference, error } = useSelector(
    (state) => state.blocks
  );
  const [fetching, setFetching] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!blocks.length && !isLoading) dispatch(fetchBlocks({}));
  }, [blocks.length, isLoading, dispatch]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const handleScroll = () => {
      if (!scrollContainer) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && !fetching) {
        setFetching(true);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  useEffect(() => {
    if (fetching && nextIndexReference) {
      dispatch(fetchBlocks({ startWithIndex: nextIndexReference }));
      setFetching(false);
    }
  }, [fetching, nextIndexReference, dispatch]);

  return (
    <div ref={scrollRef} style={{ height: "80vh", overflowY: "auto" }}>
      {blocks.map((block, index) => (
        <div key={index}>
          Block {block.index}: {block.hash}
        </div>
      ))}
      {isLoading && <p>Loading more blocks...</p>}
      {error && <p>Error fetching blocks: {error}</p>}
    </div>
  );
};

export default InfiniteScrollBlocks;

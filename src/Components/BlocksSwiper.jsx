/*
  File: BlocksSwiper.jsx
  Description: 
  This component renders a swiper of blocks. It fetches a range of blocks from 
  the Redux store and displays them in a horizontal scrollable container. The 
  user can drag to scroll through the blocks. Each block is a link to the 
  block's detail page. 

  The swiper centers on a specified block index when it first renders and 
  whenever the specified index changes. The component also handles loading 
  and error states.
*/

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlocks, resetBlocks } from "../store/blocksSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BlocksSwiper = ({
  scope,
  sort,
  recordLimit,
  pageLimit,
  startIndex = 0,
  centerOnIndex,
}) => {
  const dispatch = useDispatch();
  const { blocks, isLoading, error } = useSelector((state) => state.blocks);
  const containerRef = useRef(null);
  const [initialScroll, setInitialScroll] = useState(0);

  useEffect(() => {
    dispatch(
      fetchBlocks({
        scope,
        sort,
        recordLimit,
        pageLimit,
        startIndex,
      })
    );

    return () => {
      dispatch(resetBlocks());
    };
  }, [dispatch, centerOnIndex]);

  useEffect(() => {
    if (
      containerRef.current &&
      blocks.length > 0 &&
      centerOnIndex !== undefined
    ) {
      const blockArrayIndex = blocks.findIndex(
        (block) => block.index === centerOnIndex
      );
      if (blockArrayIndex !== -1) {
        const containerWidth = containerRef.current.offsetWidth;
        const blockWidth = 100;
        const lineWidth = 33;
        const initialScrollPosition =
          (blockWidth + lineWidth) * blockArrayIndex -
          containerWidth / 2 +
          blockWidth / 2;
        containerRef.current.scrollLeft = initialScrollPosition;
      }
    }
  }, [blocks, centerOnIndex]);

  const bind = useDrag(
    ({ movement: [mx], memo = containerRef.current.scrollLeft }) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = memo - mx;
      }
      return memo;
    },
    { axis: "x", filterTaps: true, pointer: { capture: true } }
  );

  const blockArrayIndex = blocks.findIndex(
    (block) => block.index === centerOnIndex
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <style>
        {`
          .latest-blocks-swiper {
            cursor: grab;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
          }

          .latest-blocks-swiper::-webkit-scrollbar {
            display: none; /* WebKit */
          }

          .miniCard {
            min-width: 100px;
            max-width: 100px;
            height: 100px; 
          }

          .horizontal-line {
            height: 2px;
            width: 33px; 
          }

          .no-select {
            user-select: none; /* Standard syntax */
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
          }
        `}
      </style>
      <div
        ref={containerRef}
        {...bind()}
        className="latest-blocks-swiper overflow-x-auto d-flex flex-row flex-nowrap overflow-auto align-items-center"
      >
        {blocks.map((block, index) => (
          <React.Fragment key={block.index}>
            {index !== 0 && (
              <div className="bg-info-solid">
                <hr className="horizontal-line my-0"></hr>
              </div>
            )}
            <Card
              className={`miniCard border-2 rounded-3 ${
                index === blockArrayIndex
                  ? "bg-info-highlight border-info-highlight"
                  : "bg-info-muted border-info"
              } `}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Link
                  to={`/blocks/${block.index}`}
                  className={` ${
                    index === blockArrayIndex ? "link-light" : "link-info"
                  }`}
                >
                  <div className="fs-6 no-select ">#{block.index}</div>
                </Link>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default BlocksSwiper;

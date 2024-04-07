import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLatestBlocks,
  resetLatestBlocks,
} from "../store/blocksLatestSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";

const BlocksSwiper = () => {
  const dispatch = useDispatch();
  const { latestBlocks } = useSelector((state) => state.latestBlocks);
  const containerRef = useRef(null);
  const [initialScroll, setInitialScroll] = useState(0);

  useEffect(() => {
    dispatch(fetchLatestBlocks());

    return () => {
      dispatch(resetLatestBlocks());
    };
  }, [dispatch]);

  const bind = useDrag(
    ({ down, movement: [mx], first }) => {
      if (containerRef.current) {
        if (first) {
          setInitialScroll(containerRef.current.scrollLeft);
        }
        const newScrollPosition = initialScroll - mx;
        containerRef.current.scrollLeft = newScrollPosition;
      }
    },
    {
      axis: "x",
    }
  );

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
        {latestBlocks.map((block, index) => (
          <React.Fragment key={block.index}>
            {index !== 0 && (
              <div className="bg-info">
                <hr className="horizontal-line my-0"></hr>
              </div>
            )}
            {/* Horizontal line between cards */}
            <Card className="bg-info bg-opacity-50 miniCard border-2 border-info">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="fs-6 no-select">#{block.index}</div>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default BlocksSwiper;

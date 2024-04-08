import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLatestBlocks,
  resetLatestBlocks,
} from "../store/blocksLatestSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";

const BlocksSwiper = ({ mode = "latest", centerIndex = 0 }) => {
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

  useEffect(() => {
    if (containerRef.current && latestBlocks.length > 0) {
      console.log("Center Index:", centerIndex);
      let initialScrollPosition = 0;

      if (mode === "centerOnBlock") {
        // Your existing logic to calculate the initialScrollPosition
        // for centering on centerIndex
        const containerWidth = containerRef.current.offsetWidth;
        const blockWidth = 100;
        const lineWidth = 33;
        const blockPlusLineWidth =
          blockWidth +
          (centerIndex === latestBlocks.length - 1 ? 0 : lineWidth);
        initialScrollPosition =
          blockPlusLineWidth * centerIndex -
          containerWidth / 2 +
          blockWidth / 2;
      }
      // For 'latest' mode, initialScrollPosition remains 0, which is the default

      containerRef.current.scrollLeft = initialScrollPosition;
    }
  }, [latestBlocks, mode, centerIndex]);

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
            <Card
              className={`miniCard border-2 ${
                mode === "centerOnBlock" && index === centerIndex
                  ? "bg-info bg-opacity-75 border-secondary"
                  : "bg-info bg-opacity-25 border-info"
              } `}
            >
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

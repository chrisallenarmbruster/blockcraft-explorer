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
            -webkit-overflow-scrolling: touch;
            overflow-x: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
          }

          .latest-blocks-swiper::-webkit-scrollbar {
            display: none; /* WebKit */
          }
        `}
      </style>
      <div
        ref={containerRef}
        {...bind()}
        className="latest-blocks-swiper d-flex flex-row flex-nowrap overflow-auto"
        style={{ cursor: "grab" }}
      >
        {latestBlocks.map((block) => (
          <Card
            className="mx-2 my-3"
            key={block.index}
            style={{
              minWidth: "100px",
              maxWidth: "100px",
              minHeight: "100px",
              maxHeight: "100px",
            }}
          >
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div className="fs-6">#{block.index}</div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default BlocksSwiper;

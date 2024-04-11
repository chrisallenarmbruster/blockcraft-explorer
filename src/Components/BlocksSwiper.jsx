import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlocksRange, resetBlocks } from "../store/blocksRangeSlice";
import { useDrag } from "@use-gesture/react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BlocksSwiper = ({ radius, centerOnIndex }) => {
  const dispatch = useDispatch();
  const { blocks, isLoading, error } = useSelector(
    (state) => state.blocksRange
  );
  const containerRef = useRef(null);
  const [initialScroll, setInitialScroll] = useState(0);

  useEffect(() => {
    dispatch(fetchBlocksRange({ radius, centerOnIndex }));

    return () => {
      dispatch(resetBlocks());
    };
  }, [dispatch, radius, centerOnIndex]);

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
              <div className="bg-black">
                <hr className="horizontal-line my-0"></hr>
              </div>
            )}
            <Card
              className={`miniCard border-2 rounded-3 ${
                index === blockArrayIndex
                  ? "bg-info bg-opacity-50 border-info"
                  : "bg-info bg-opacity-25 border-info"
              } `}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Link
                  to={`/blocks/${block.index}`}
                  className="link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
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

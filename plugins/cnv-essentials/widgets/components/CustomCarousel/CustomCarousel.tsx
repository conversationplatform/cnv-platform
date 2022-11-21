import React from "react";
import Carousel from "@brainhubeu/react-carousel";
import { makeStyles } from "@material-ui/core/styles";

import "@brainhubeu/react-carousel/lib/style.css";

const useStyles = makeStyles(() => ({
  carousel: {
    height: "100%",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  icon: {
    color: "var(--conversation-app-primary-color)",
  }
}));

function CustomCarousel({ slides, setIndexOnChange, value }) {
  const classes = useStyles();

  const handleOnChange = (currValue) => {
    setIndexOnChange && setIndexOnChange(currValue);
  };

  return (
    <Carousel
      draggable
      value={value}
      centered
      slidesPerPage={3}
      slidesPerScroll={1}
      slides={slides}
      itemWidth={280}
      offset={20}
      onChange={handleOnChange}
      stopAutoPlayOnHover
      className={classes.carousel}
    />
  );
}

export default CustomCarousel;

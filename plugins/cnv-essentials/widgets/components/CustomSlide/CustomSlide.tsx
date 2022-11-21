import React, { useEffect } from "react";
import parse from "html-react-parser";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import ArrowRightIcon from "@material-ui/icons/ChevronRight";

import md from 'markdown-it';
const markdown = md();

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    cursor: "grab",
    width: 290,
    minWidth: 290,
    maxWidth: 290,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    transition: "all 0.4s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  content: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f64884",
    justifyContent: "center",
    height: 30,
    zIndex: 99999,
    borderRadius: "10px 10px 0px 0px",
  },
  badgeHidden: {
    marginRight: "auto",
    paddingRight: 12,
    visibility: "hidden",
  },
  headline: {
    height: 30,
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: 0.24,
    paddingLeft: 57,
  },
  badge: {
    position: "fixed",
    right: 12,
    marginLeft: "auto",
    top: -7,
    width: 42,
    height: 46,
    overflow: "visible",
  },
  badgeImage: {
    right: 12,
    marginLeft: "auto",
    marginTop: -7,
    marginRight: 13,
    width: 42,
    height: 46,
    overflow: "visible",
    objectFit: "contain",
  },
  image: {
    backgroundImage:
      "linear-gradient(113deg, var(--conversation-app-gradient-color-1), var(--conversation-app-gradient-color-2) 101%) !important",
  },
  title: {
    letterSpacing: "normal",
    fontSize: 18,
    fontWeight: 700,
    fontStretch: "normal",
    fontStyle: "normal",
    textAlign: "left",
    lineHeight: 1.22,
    color: "var(--conversation-app-primary-color)",
    margin: "25px 30px 5px 30px",
  },
  text: {
    color: "#3e3e3e",
    margin: "0 30px",
    fontSize: 14,
    fontWeight: 300,
    fontStretch: "normal",
    fontStyle: "normal",
    wordBreak: "break-word",
    lineHeight: 1.33,
    letterSpacing: "normal",
    textAlign: "left",
    overflow: "auto",
  },
  linkWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "fit-content",
    margin: "0 30px 20px",
    cursor: "pointer",
  },
  link: {
    color: "var(--conversation-app-primary-color)",
    fontSize: 15,
    fontWeight: 300,
    fontStretch: "normal",
    fontStyle: "normal",
    wordBreak: "break-word",
    lineHeight: 1.33,
    letterSpacing: "normal",
    textAlign: "left",
    marginTop: 1,
  },
  icon: {
    color: "var(--conversation-app-primary-color)",
  },
}));

function CustomSlide({
  headline,
  badge,
  image: img,
  title,
  text,
  name,
  onSlideSelect,
  index,
  activeIndex,
  connection,
  continueUrl,
}) {
  const classes = useStyles();
  const image = img ;
  const renderedText = markdown.render(text);

  useEffect(() => {
    const setSelectedSlide = (value) => {
      onSlideSelect(value);
    };

    if (index === activeIndex) {
      setSelectedSlide(name);
    }
  }, [index, activeIndex, name]);

  return (
    <Card className={classes.card} variant="outlined">
      {badge && (
        <div className={classes.content}>
          <div className={classes.headline}>{headline.toUpperCase()}</div>
          <img
            className={classes.badgeImage}
            src={badge ? badge : null}
            alt="badge"
          />
        </div>
      )}

      {image && (
        <div className={classes.image}>
          <img width="290px" height="200px" src={image} alt="carousel-image" />
        </div>
      )}
      <div className={classes.title}>{title.toUpperCase()}</div>
      <div className={classes.text}>{parse(renderedText)}</div>
      <div className={classes.linkWrapper}>
        <div className={classes.link} onClick={() => connection.send(name)}>
          {`${continueUrl ? continueUrl : "Finde mehr heraus?"}`}
        </div>
        <ArrowRightIcon className={classes.icon} />
      </div>
    </Card>
  );
}

export default CustomSlide;

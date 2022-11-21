import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: 290,
    minWidth: 290,
    maxWidth: 290,
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 10,
    marginBottom: 10,
    overflow: "visible",
    backgroundImage: "linear-gradient(113deg, var(--conversation-app-gradient-color-1), var(--conversation-app-gradient-color-2) 101%)",
    transition: "all 0.4s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  divider: {
    height: 86,
    minHeight: 86,
    maxHeight: 86,
  },
  headline: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: 1.22,
    letterSpacing: 0.24,
    margin: "0 22px 20px 22px",
  },
  iconWrapper: {
    top: -36,
    height: 80,
    width: 80,
    borderRadius: "50%",
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "#fff",
    boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.15)",
  },
  icon: {
    top: 16,
    width: 64,
    height: 50,
    position: "relative",
    overflow: "visible",
    objectFit: "contain",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    margin: "15px 22px",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 300,
    fontStretch: "normal",
    fontStyle: "normal",
    wordBreak: "break-word",
    lineHeight: 1.33,
    letterSpacing: "normal",
    textAlign: "left",
    overflow: "auto",
    alignSelf: "center",
  },
  checkIcon: {
    color: "#fff",
    paddingRight: 15,
    alignSelf: "center",
    width: 24,
    height: 24,
  },
}));

function CustomSlideProduct({
  headline,
  image: icon,
  items,
  name,
  onSlideSelect,
  index,
  activeIndex,
}) {
  const classes = useStyles();

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
      {
        <div className={classes.iconWrapper}>
          <img className={classes.icon} src={icon ? icon : null} alt="icon" />
        </div>
      }
      <div className={classes.divider} />
      <div className={classes.headline}>{headline.toUpperCase()}</div>
      {items &&
        items.map((text, i) => (
          <div key={`${text}${i}`} className={classes.item}>
            {<CheckCircleIcon className={classes.checkIcon} />}
            <div className={classes.text}>{text}</div>
          </div>
        ))}
    </Card>
  );
}

export default CustomSlideProduct;

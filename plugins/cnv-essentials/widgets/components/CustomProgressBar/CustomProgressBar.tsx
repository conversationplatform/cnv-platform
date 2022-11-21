import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  main: {
    height: 28,
    width: "100%",
    backgroundColor: "transparent",
    borderTopRightRadius: (props) => (props.isCompleted ? 0 : 14),
    borderBottomRightRadius: (props) => (props.isCompleted ? 0 : 14),
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  label: {
    width: 28,
    height: 18,
    alignSelf: "center",
    fontSize: 14,
    fontWeight: 600,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: 0.24,
    textAlign: "center",
    color: "#fff",
  },
}));

function CustomProgressBar(props) {
  const { bgColor, completed } = props;

  const isCompleted = completed === 100;
  const classes = useStyles({ isCompleted });

  const labelWrapper = {
    height: "100%",
    width: `${completed}%`,
    display: "flex",
    justifyContent: "center",
    backgroundColor: bgColor,
    borderRadius: "inherit",
  };

  const labelWrapperZeroPercent = {
    height: "100%",
    width: "10%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: bgColor,
    borderRadius: "inherit",
  }

  return (
    <div className={classes.main}>
      {completed >= 10 && (
        <div style={labelWrapper}>
          <span className={classes.label}>{`${completed}%`}</span>
        </div>
      )}
      {completed < 10 && (
        <div style={labelWrapperZeroPercent}>
          <span className={classes.label}>{`0%`}</span>
        </div>
      )}
    </div>
  );
}

export default CustomProgressBar;

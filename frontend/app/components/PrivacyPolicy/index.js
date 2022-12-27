import React from "react";
import parse from "html-react-parser";
import { makeStyles } from "@material-ui/core/styles";

const markdown = require("markdown-it")();

const useStyles = makeStyles(() => ({
  main: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    backgroundColor: "var(--conversation-app-primary-color)",
    color: "var(--conversation-app-primary-text-color)",
    "& h1, h2, h3, h4": {
      color: "var(--conversation-app-primary-text-color)",
      marginBottom: "12px",
    },

    "& h1": {
      fontSize: "32px"
    },
    "& h2": {
      fontSize: "24px"
    },
    "& h3": {
      fontSize: "18.72px"
    },

    "& p": {
      color: "var(--conversation-app-primary-text-color)",
      fontSize: "16px"
    },
  },

  wrapper: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  icon: {
    margin: "0px",
    marginRight: "12px",
    transform: "rotate(180deg)",
  },

  h3: {
    margin: "0px",
  },

  title: {
    marginTop: "24px",
    marginBottom: "0px",
  },
  header: {
    height: "30%",
    position: "absolute",
    width: "100%",
    padding: "2rem"
  },
  content: {
    height: "70%",
    overflowY: "auto",
    position: "absolute",
    padding: "2rem",
    bottom: 0
  },
}));

function PrivacyPolicy(props) {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.header}>
        <div className={classes.wrapper} onClick={props.onClickBack}>
          <h3 className={classes.icon}>➜</h3>
          <h3 className={classes.h3}>Go back</h3>
        </div>
        <h1 className={classes.title}>Privacy Policy</h1>
      </div>
      <div className={classes.content}>
        {parse(markdown.render(props.text || ""))}
      </div>
    </div>
  );
}

export default PrivacyPolicy;

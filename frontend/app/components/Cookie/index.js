import React, { useState } from "react";
import PrivacyPolicy from "../PrivacyPolicy";
import parse from "html-react-parser";
const markdown = require("markdown-it")();

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "var(--conversation-app-primary-color)",
  },

  button: {
    cursor: "pointer",
    width: "100%",
    minHeight: "46px",
    textTransform: "none",
    fontSize: "15px",
    fontWeight: 400,
    fontStretch: "normal",
    fontStyle: "normal",
    letterSpacing: "0.26px",
    lineHeight: 1.33,
    textAlign: "center",
    padding: "6px 12px",
    borderRadius: "23px",
    boxShadow: "rgb(16 41 184 / 15%) 0px 0px 15px 0px",
    border: "none",
    color: "var(--conversation-app-primary-text-color)",
    backgroundColor: "var(--conversation-app-button-color)",
    transition: "all ease 0.2s",
    marginTop: "12px",

    "&:hover": {
      color: "var(--conversation-app-button-color)",
      backgroundColor: "var(--conversation-app-primary-text-color)",
    },
  },

  contentWrapper: {
    padding: "2rem",
    height: "77%",
    position: "absolute",
    top: "0",
    overflowY: "auto",
    "& h1, h2, h3, h4": {
      color: "var(--conversation-app-primary-text-color)",
      marginBottom: "12px",
    },

    "& p": {
      color: "var(--conversation-app-primary-text-color)",
    },

    "& link": {
      cursor: "pointer",
    },
  },
  footerWrapper: {
    position: "absolute",
    bottom: "1rem",
    width: "100%",
    maxWidth: "300px"
  },
}));

function Cookie(props) {
  const { welcome, privacyPolicy } = props;
  const classes = useStyles();
  const [showingPrivacyPolicy, setShowingPrivacyPolicy] = useState(false);

  const acceptCookie = () => {
    if (props.onAccept) {
      props.onAccept();
    }
  };

  if (showingPrivacyPolicy) {
    return (
      <PrivacyPolicy
        text={privacyPolicy}
        onClickBack={() => setShowingPrivacyPolicy(false)}
      />
    );
  }

  const options = {
    replace: (domNode) => {
      if (!domNode.attribs) {
        return;
      }
      const hasHref = Object.keys(domNode.attribs).includes("href");
      if (hasHref && domNode.children && domNode.children.length > 0) {
        const children = domNode.children[0].data;
        return (
          <a
            {...domNode.attribs}
            target="_blank"
            onClick={() => {
              setShowingPrivacyPolicy(true);
            }}
          >
            {children}
          </a>
        );
      }
    },
  };

  return (
    <div className={classes.main}>
      <div className={classes.contentWrapper}>
        {parse(markdown.render(welcome || ""), options)}
      </div>
      <div className={classes.footerWrapper}>
        <button className={classes.button} onClick={acceptCookie}>
          I agree
        </button>
      </div>
    </div>
  );
}

export default Cookie;

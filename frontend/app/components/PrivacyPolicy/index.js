import React, { useEffect, useState } from "react";
import parse from 'html-react-parser'
import { makeStyles } from "@material-ui/core/styles";

const markdown = require('markdown-it')()

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        backgroundColor: "var(--conversation-app-primary-color)",
        padding: "24px",
        overflow: "scroll",
        color: "var(--conversation-app-primary-text-color)",
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
}));

function PrivacyPolicy(props) {
    const classes = useStyles();

    return (
        <div className={classes.main}>
            <div className={classes.wrapper} onClick={props.onClickBack}>
                <h3 className={classes.icon}>➜</h3>
                <h3 className={classes.h3}>Go back</h3>
            </div>
            <h1 className={classes.title}>Privacy Policy</h1>
            <p>{parse(markdown.render(props.text || ""))}</p>
        </div>
    );
}

export default PrivacyPolicy;

import React, { useEffect, useState } from "react";
import PrivacyPolicy from "../PrivacyPolicy";

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

    header: {
        color: "var(--conversation-app-primary-text-color)",
        marginBottom: "12px",
    },

    paragraph: {
        color: "var(--conversation-app-primary-text-color)",
        marginBottom: "100%",
    },

    link: {
        cursor: "pointer",
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

    initial: {
        margin: "30px",
    },
}));

function Cookie(props) {
    const classes = useStyles();
    const [showingPrivacyPolicy, setShowingPrivacyPolicy] = useState(false);

    const acceptCookie = () => {
        if (props.onAccept) {
            props.onAccept();
        }
    };

    if (showingPrivacyPolicy) {
        return <PrivacyPolicy text={props.privacyPolicy} onClickBack={() => setShowingPrivacyPolicy(false)} />;
    }

    return (
        <div className={classes.main}>
            <div className={classes.initial}>
                <h2 className={classes.header}>Welcome to the Tinyme application</h2>
                <p className={classes.paragraph}>
                    Please agree to the terms of our{" "}
                    <a
                        className={classes.link}
                        onClick={() => {
                            setShowingPrivacyPolicy(true);
                        }}
                    >
                        privacy policy
                    </a>{" "}
                    before we begin.
                </p>
                <button className={classes.button} onClick={acceptCookie}>
                    I agree
                </button>
            </div>
        </div>
    );
}

export default Cookie;

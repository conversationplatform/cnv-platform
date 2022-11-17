import React from "react";

import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(() => ({
  main: {
    width: "100%",
    position: "relative",
    padding: '30px'
  },
    
  button: {
    cursor: 'pointer',
    width: '100%',
    minHeight: '46px',
    textTransform: 'none',
    fontSize: '15px',
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: '0.26px',
    lineHeight: 1.33,
    textAlign: 'center',
    padding: '6px 12px',
    borderRadius: '23px',
    boxShadow: 'rgb(16 41 184 / 15%) 0px 0px 15px 0px',
    border: 'none',
    color: 'var(--conversation-app-primary-text-color)',
    backgroundColor: 'var(--conversation-app-button-color)',

    '&:hover': {
      color: 'var(--conversation-app-button-color)',
      backgroundColor: 'var(--conversation-app-primary-text-color)',
    },
  }
}));

function Restart({
  connection
}) {
  const classes = useStyles();
  const restart = () => {
    connection.restart();
  }
  return (
    <div className={classes.main}>
      
        <button className={classes.button} onClick={restart}>Restart</button>
      </div>
  );
}

export default Restart;

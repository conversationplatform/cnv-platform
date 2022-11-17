import React from "react";

import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(() => ({
  main: {
    width: "100%",
    position: "relative"
  },
    
  logger: {
    position: "relative",
    boxShadow: "0 -2px 15px 0 rgba(0, 0, 0, 0.15)",
    backgroundColor: "#f64884",
    borderRadius: 10,
    padding: 16,
    marginLeft: 6,
    textAlign: "left",
    color: "#fff",
    
  },
  loggerMsg: {
    width: "100%",
  },
}));

function Logger({
  error,
  message,
  
}) {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      
        <div className={classes.logger}>
           <div className={classes.loggerMsg} >
             <strong>{error}</strong>
          </div>
          {message}
        </div>
      
    </div>
  );
}

export default Logger;

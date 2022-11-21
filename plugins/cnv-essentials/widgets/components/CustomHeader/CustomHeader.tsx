import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  main: {
    display: "flex",
    justifyContent: "flex-start",
    height: 120,
    width: "100%",
    position: "fixed",
    overflowWrap: "anywhere",
    backgroundImage: "linear-gradient(113deg, var(--conversation-app-gradient-color-1), var(--conversation-app-gradient-color-2) 101%)",
  },
  tab: {
    color: "#fff",
    fontSize: 15,
    padding: 12,
    alignSelf: "flex-end",
    cursor: "pointer",
    fontWeight: 700,
    "&:first-child": {
      paddingLeft: 32,
    },
  },
  activeTab: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    padding: 12,
    alignSelf: "flex-end",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlinePosition: "under",
    "&:first-child": {
      paddingLeft: 32,
    },
  },
}));

function CustomHeader({ tabs, setSelectedTab }) {
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const classes = useStyles();

  const toggleActiveTab = (selectedTab, index) => {
    setActiveTab(selectedTab);
    setSelectedTab && setSelectedTab(tabs[index]);
  };

  return (
    <div className={classes.main}>
      {tabs &&
        tabs.map(({ title: tab }, index) => {
          return (
            <div
              key={`${tab}-${index}`}
              className={tab === activeTab ? classes.activeTab : classes.tab}
              onClick={() => toggleActiveTab(tab, index)}
            >
              {tab.toUpperCase()}
            </div>
          );
        })}
    </div>
  );
}

export default CustomHeader;

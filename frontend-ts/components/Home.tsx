import React, { useState} from "react";

const styles = {
  title: {
    fontSize: "15px",
    fontWeight: "500",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.4rem 1.2rem rgb(1 16 10 / 50%)",
    border: "1px solid #e7eaf3",
    borderRadius: "9.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
  // button: {
  //   boxShadow: "0 0.4rem 1.2rem rgb(189 16 10 / 50%)",
  //   border: "1px solid #e7eaf3",
  //   borderRadius: "3.5rem",
  // }
};

export default function Home() {
  return (
    <>
      <div className="topDiv">
        <div className="divHeader">
          <h1>STAKEVERSE</h1>
        </div>
        <div
          className="cardAttribute"
          // onClick={toStaking}
        >
        
        <h2>StakeVerse</h2>
        </div>
        <div className="cardAttribute">
        <h2>StakeWar</h2>
        </div>
      </div>
    </>
  );
}

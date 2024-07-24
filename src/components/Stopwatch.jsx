import React, { useState, useEffect } from "react";

export default function Stopwatch(props) {
  return (
    <div className="stopwatch-container">
      <p className="stopwatch-time">
        {props.minutes.toString().padStart(2, "0")}:{props.seconds.toString().padStart(2, "0")}:{props.milliseconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
}

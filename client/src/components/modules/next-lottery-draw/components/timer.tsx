"use client";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";

const Timer = () => {
  return (
    <Countdown
      className="text-end max-sm:text-start"
      date={Date.now() + 1000000000}
      renderer={(props) => {
        const { days, hours, minutes, seconds } = props;

        return (
          <div className="font-bold text-lg text-white flex gap-4 justify-end max-sm:justify-start">
            <div className="w-10">
               <div className="w-10 h-10 bg-[#023a30] flex items-center justify-center">{days}</div>
               <div className="text-sm text-center">days</div>
            </div>
            <div className="w-10">
               <div className="w-10 h-10 bg-[#023a30] flex items-center justify-center">{hours}</div>
               <div className="text-sm text-center">hours</div>
            </div>
            <div className="w-10">
               <div className="w-10 h-10 bg-[#023a30] flex items-center justify-center">{minutes}</div>
               <div className="text-sm text-center">mins</div>
            </div>
            <div className="w-10">
               <div className="w-10 h-10 bg-[#023a30] flex items-center justify-center">{seconds}</div>
               <div className="text-sm text-center">secs</div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Timer;

"use client";
import React from "react";
import Countdown from "react-countdown";

const Timer = ({ date }: { date: number }) => {
  return (
    <Countdown
      date={date}
      renderer={(props) => {
        const { days, hours, minutes, seconds, completed } = props;
        
        if (completed) {
          return <span className="text-[#F43F5E] font-bold">Draw in progress</span>;
        }
        
        return (
          <div className="font-bold flex flex-wrap gap-2 justify-end max-sm:justify-start">
            <div className="flex gap-2">
              {days > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#1E293B] border border-[#6366F1]/30 rounded-md flex items-center justify-center text-[#6366F1] shadow-lg shadow-[#6366F1]/5">
                    {days}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">days</div>
                </div>
              )}
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#1E293B] border border-[#6366F1]/30 rounded-md flex items-center justify-center text-[#6366F1] shadow-lg shadow-[#6366F1]/5">
                  {String(hours).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">hours</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#1E293B] border border-[#6366F1]/30 rounded-md flex items-center justify-center text-[#6366F1] shadow-lg shadow-[#6366F1]/5">
                  {String(minutes).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">mins</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#1E293B] border border-[#6366F1]/30 rounded-md flex items-center justify-center text-[#6366F1] shadow-lg shadow-[#6366F1]/5">
                  {String(seconds).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400 mt-1">secs</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Timer;
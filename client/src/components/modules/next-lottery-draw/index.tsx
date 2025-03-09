"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import TicketList from "./components/ticket-list";
import { useDlottery } from "@/hooks";

const NextLotteryDraw = () => {
  const { currentDrawInfo } = useDlottery();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Only set up countdown if we have a valid draw time
    if (!currentDrawInfo?.drawTime || currentDrawInfo?.completed) return;

    const targetDate = currentDrawInfo.drawTime;

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Time's up
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setCountdown(calculateTimeLeft());

    // Set up interval to update every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [currentDrawInfo]);

  // Format the countdown for display
  const formattedCountdown = !currentDrawInfo?.drawTime
    ? "Not scheduled"
    : currentDrawInfo.completed
    ? "Completed"
    : `${countdown.days > 0 ? `${countdown.days}d ` : ""}${String(
        countdown.hours
      ).padStart(2, "0")}:${String(countdown.minutes).padStart(
        2,
        "0"
      )}:${String(countdown.seconds).padStart(2, "0")}`;

  return (
    <div className="bg-white rounded-lg p-5">
      <div className="flex justify-between mb-5 max-sm:flex-col">
        <div>
          <div className="font-bold text-lg">Next Lottery Draw</div>
          <div className="font-bold text-base text-gray-500">
            Prize: {currentDrawInfo?.prize || "0"} ETH
          </div>
        </div>
        <div>
          <div className="font-bold text-base text-gray-500 ">
            Draw Date:{" "}
            {currentDrawInfo?.drawTime?.toDateString() || "Not scheduled"}
          </div>
          <div className="font-bold text-lg text-[#4f46e5] text-end max-sm:text-start">
            {formattedCountdown}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button className="bg-[#4f46e5] hover:bg-[#342db6] w-fit">
          Participate to next draw
        </Button>

        <TicketList />
      </div>
    </div>
  );
};

export default NextLotteryDraw;

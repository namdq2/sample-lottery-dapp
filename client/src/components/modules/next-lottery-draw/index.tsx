"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import TicketList from "./components/ticket-list";
import { useDlottery } from "@/hooks";
import { useAccount } from "wagmi";

const NextLotteryDraw = () => {
  const { address } = useAccount();
  const { currentDrawInfo, remainingTickets } = useDlottery();
  const { participate, isParticipating, participateData, participateError } =
    useDlottery();
  const {
    withdrawPrize,
    isWithdrawingPrize,
    withdrawPrizeData,
    withdrawPrizeError,
  } = useDlottery();

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleClaimPrize = async () => {
    try {
      console.log("withdrawPrize");
      withdrawPrize();
    } catch (error) {
      console.error("Error withdrawing prize:", error);
      alert("Failed to withdraw prize. See console for details.");
    }
  };

  const handleParticipate = async () => {
    try {
      console.log("participate");
      participate();
    } catch (error) {
      console.error("Error participating:", error);
      alert("Failed to participate. See console for details.");
    }
  };

  useEffect(() => {
    if (withdrawPrizeData) {
      alert("Prize withdrawn successfully!");
    }
    if (withdrawPrizeError) {
      console.error("Error withdrawing prize:", withdrawPrizeError);
      alert("Failed to withdraw prize.");
    }
  }, [withdrawPrizeData, withdrawPrizeError]);

  useEffect(() => {
    if (participateData) {
      alert("Draw performed successfully!");
    }
    if (participateError) {
      console.error("Error performing draw:", participateError);
      alert("Failed to perform draw.");
    }
  }, [participateData, participateError]);

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
  const formattedCountdown = currentDrawInfo?.completed
    ? null
    : !currentDrawInfo?.drawTime
    ? "Not scheduled"
    : currentDrawInfo?.drawTime?.getTime() < Date.now()
    ? "Draw in progress"
    : `${countdown.days > 0 ? `${countdown.days}d ` : ""}${String(
        countdown.hours
      ).padStart(2, "0")}:${String(countdown.minutes).padStart(
        2,
        "0"
      )}:${String(countdown.seconds).padStart(2, "0")}`;

  const formattedNextDrawDate = currentDrawInfo?.completed
    ? "Coming soon!"
    : currentDrawInfo?.drawTime?.toUTCString() || "Not scheduled";

  const formattedPrize = currentDrawInfo?.completed
    ? ""
    : "Prize: " + currentDrawInfo?.prize + " ETH" || "Prize: 0 POL";

  if (currentDrawInfo?.completed) {
    return (
      <div className="bg-white rounded-lg p-5">
        <div className="font-bold text-lg">No upcoming draws</div>
      </div>
    );
  }

  return (
    <div className="border border-[#0d2925] rounded-lg p-5">
      <div className="flex justify-between mb-5 max-sm:flex-col">
        <div>
          <div className="font-bold text-lg text-white">Next Lottery Draw</div>
          <div className="font-bold text-base text-gray-500">
            {formattedPrize}
          </div>
          <div className="font-bold text-base text-gray-500">
            Remaining: {remainingTickets} tickets
          </div>
        </div>
        <div>
          <div className="font-bold text-base text-gray-500 ">
            Draw Date: {formattedNextDrawDate}
          </div>
          <div className="font-bold text-lg text-[#4f46e5] text-end max-sm:text-start">
            {formattedCountdown}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          className="bg-transparent border border-[#4f46e5] hover:bg-[#342db6] w-fit"
          onClick={handleParticipate}
          disabled={
            isParticipating ||
            !(
              !currentDrawInfo?.completed &&
              Number(currentDrawInfo?.prize) >= 0 &&
              (currentDrawInfo?.drawTime?.getTime() || 0) > Date.now()
            )
          }
        >
          Participate to next draw
        </Button>

        {address === currentDrawInfo?.winner && currentDrawInfo?.completed && (
          <div className="text-white font-bold text-lg">
            <div className="text-white font-bold text-lg">
              You won the last draw!
            </div>
            <Button
              className="bg-transparent border border-[#4f46e5] hover:bg-[#342db6] w-fit"
              onClick={handleClaimPrize}
              disabled={
                isWithdrawingPrize ||
                !(
                  currentDrawInfo?.completed &&
                  currentDrawInfo?.winner === address
                )
              }
            >
              Claim Prize
            </Button>
          </div>
        )}

        <TicketList />
      </div>
    </div>
  );
};

export default NextLotteryDraw;

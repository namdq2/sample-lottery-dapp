"use client";
import React, {useEffect} from "react";
import {Button} from "../../ui/button";
import TicketList from "./components/ticket-list";
import Timer from "./components/timer";
import {useDlottery} from "@/hooks";
import {useAccount} from "wagmi";
import {Loader2, Award, Ticket, Clock} from "lucide-react";
import {useToast} from "@/components/context/toast-context";

const NextLotteryDraw = () => {
  const {address} = useAccount();
  const {currentDrawInfo, remainingTickets} = useDlottery();
  const {participate, isParticipating, participateData, participateError} =
    useDlottery();
  const {
    withdrawPrize,
    isWithdrawingPrize,
    withdrawPrizeData,
    withdrawPrizeError,
  } = useDlottery();
  const {showToast} = useToast();

  const handleClaimPrize = async () => {
    try {
      withdrawPrize();
    } catch (error) {
      console.error("Error withdrawing prize:", error);
      showToast(
        "Claim Failed",
        "error",
        "Failed to withdraw prize. See console for details."
      );
    }
  };

  const handleParticipate = async () => {
    try {
      participate();
    } catch (error) {
      console.error("Error participating:", error);
      showToast(
        "Participation Failed",
        "error",
        "Failed to participate. See console for details."
      );
    }
  };

  // Transaction feedback with toasts
  useEffect(() => {
    if (participateData)
      showToast(
        "Ticket Purchased",
        "success",
        "You have successfully purchased a lottery ticket!"
      );
    if (participateError)
      showToast("Purchase Failed", "error", "Failed to purchase a ticket.");
  }, [participateData, participateError, showToast]);

  useEffect(() => {
    if (withdrawPrizeData)
      showToast(
        "Prize Claimed",
        "success",
        "You have successfully claimed your prize!"
      );
    if (withdrawPrizeError)
      showToast("Claim Failed", "error", "Failed to claim your prize.");
  }, [withdrawPrizeData, withdrawPrizeError, showToast]);

  // Check if user can participate
  const canParticipate =
    !isParticipating &&
    !currentDrawInfo?.completed &&
    Number(currentDrawInfo?.prize) >= 0 &&
    (currentDrawInfo?.drawTime?.getTime() || 0) > Date.now();

  // Check if user can claim prize
  const canClaimPrize =
    !isWithdrawingPrize &&
    currentDrawInfo?.completed &&
    currentDrawInfo?.winner === address;

  // Format the draw date
  const formattedNextDrawDate =
    currentDrawInfo?.drawTime?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) || "Not scheduled";

  // Format the prize amount
  const formattedPrize = currentDrawInfo?.prize
    ? `${Number(currentDrawInfo.prize).toLocaleString()} BNB`
    : "0 BNB";

  // If no current draw at all
  if (!currentDrawInfo) {
    return (
      <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg text-center">
        <div className="font-bold text-lg text-white mb-4">
          No lottery draws available
        </div>
        <p className="text-gray-400">Check back later for upcoming draws</p>
      </div>
    );
  }

  if (currentDrawInfo.completed && currentDrawInfo.winner == "0x0000000000000000000000000000000000000000") {
    return (
      <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg text-center">
        <div className="font-bold text-lg text-white mb-4">
          No winner for this draw
        </div>
        <p className="text-gray-400">Next draw coming soon</p>
      </div>
    );
  }

  if (currentDrawInfo.completed && currentDrawInfo.winner != "0x0000000000000000000000000000000000000000" && Number(currentDrawInfo?.prize) > 0 && currentDrawInfo?.winner !== address) {
    return (
      <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg text-center">
        <div className="font-bold text-lg text-white mb-4">
          The winner is {currentDrawInfo.winner}!. Congratulations!
        </div>
      </div>
    );
  }

  // If draw is completed
  if (currentDrawInfo.completed) {
    return (
      <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="font-bold text-xl text-white mb-1">
              Draw Completed
            </h3>
            <p className="text-gray-400">Next draw coming soon</p>
          </div>

          {canClaimPrize && (
            <div className="bg-[#0A0F1E]/70 rounded-lg p-4 border border-[#FBBF24]/30 w-full md:w-auto">
              <div className="text-[#FBBF24] font-bold text-lg flex items-center gap-2 mb-3">
                <Award className="h-5 w-5"/>
                <span>You won {formattedPrize}!</span>
              </div>
              <Button
                className="bg-[#FBBF24] hover:bg-[#FBBF24]/80 text-black w-full"
                onClick={handleClaimPrize}
                disabled={
                  isWithdrawingPrize || Number(currentDrawInfo.prize) === 0
                }
              >
                {isWithdrawingPrize ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Claiming...
                  </>
                ) : Number(currentDrawInfo.prize) === 0 ? (
                  <>Claimed Prize</>
                ) : (
                  <>Claim Prize</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="font-bold text-xl text-white mb-1">
            Next Lottery Draw
          </h3>
          <div className="flex items-center gap-2 text-[#10B981] font-medium">
            <Award className="h-4 w-4"/>
            <span>Prize: {formattedPrize}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Ticket className="h-4 w-4"/>
            <span>{remainingTickets} tickets remaining</span>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 text-gray-400 mb-2 justify-end max-sm:justify-start">
            <Clock className="h-4 w-4"/>
            <span>{formattedNextDrawDate}</span>
          </div>
          {currentDrawInfo?.drawTime && (
            <Timer date={currentDrawInfo.drawTime.getTime()}/>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {canParticipate && (
          <div className="flex justify-center">
            <Button
              className="bg-[#6366F1] hover:bg-[#6366F1]/80 px-6 py-6 rounded-xl font-medium text-lg"
              onClick={handleParticipate}
              disabled={isParticipating}
            >
              {isParticipating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Processing...
                </div>
              ) : (
                <>Participate in Draw</>
              )}
            </Button>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-lg font-medium text-white mb-3">
            Current Tickets
          </h4>
          <TicketList/>
        </div>
      </div>
    </div>
  );
};

export default NextLotteryDraw;

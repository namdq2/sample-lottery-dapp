import AdminPanel from "@/components/modules/admin-panel";
import NextLotteryDraw from "@/components/modules/next-lottery-draw";
import PreviousDraw from "@/components/modules/previous-draw";
import React from "react";

const winnerAddress = "JHOUIHOH11728KJGHG";
const winningValue = 0.036;

const Lottery = () => {
  return (
    <div className="h-svh">
      <div className="bg-[#0d2925] py-4 relative">
        <div className="text-white font-bold moving-text">
          Last Winner: {winnerAddress}, Previous Winnings: {winningValue} MATIC
        </div>
      </div>
      <div className="px-14 py-8 flex flex-col gap-5">
        <AdminPanel />
        <NextLotteryDraw />
        <PreviousDraw />
      </div>
    </div>
  );
};

export default Lottery;

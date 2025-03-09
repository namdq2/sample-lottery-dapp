import React from "react";
import { Button } from "../../ui/button";
import TicketList from "./components/ticket-list";
import Timer from "./components/timer";

const NextLotteryDraw = () => {
  return (
    <div className="bg-[#091818] border border-[#0d2925] rounded-lg p-5">
      <div className="flex justify-between mb-5 max-sm:flex-col">
        <div>
          <div className="font-bold text-lg text-white">Next Lottery Draw</div>
          <div className="font-bold text-base text-gray-400">
            Prize: 0.01 ETH
          </div>
        </div>
        <div>
          <div className="font-bold text-base text-gray-400">
            Draw Date: March 15, 2025 18:00 UTC
          </div>
          <Timer/>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button className="bg-[#091818] border border-[#036756] hover:bg-[#059669] w-fit">
          Participate to next draw
        </Button>

        <TicketList />
      </div>
    </div>
  );
};

export default NextLotteryDraw;

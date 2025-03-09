import React from "react";
import { Button } from "../../ui/button";
import TicketList from "./components/ticket-list";

const NextLotteryDraw = () => {
  return (
    <div className="bg-white rounded-lg p-5">
      <div className="flex justify-between mb-5 max-sm:flex-col">
        <div>
          <div className="font-bold text-lg">Next Lottery Draw</div>
          <div className="font-bold text-base text-gray-500">
            Prize: 0.01 ETH
          </div>
        </div>
        <div>
          <div className="font-bold text-base text-gray-500 ">
            Draw Date: March 15, 2025 18:00 UTC
          </div>
          <div className="font-bold text-lg text-[#4f46e5] text-end max-sm:text-start">
            23:59:59
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

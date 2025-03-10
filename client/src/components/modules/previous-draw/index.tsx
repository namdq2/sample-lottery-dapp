import React from "react";
import TicketList from "./components/ticket-list";
import { Trophy } from "lucide-react";

const PreviousDraw = () => {
  return (
    <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg border border-[#1E293B]/50 transition-all">
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-[#FBBF24]/10 p-1.5 rounded-full flex items-center justify-center">
          <Trophy className="text-[#FBBF24] h-5 w-5" />
        </div>
        <h3 className="font-bold text-xl text-white">Previous Draws</h3>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#0A0F1E]/50">
        <TicketList />
      </div>
    </div>
  );
};

export default PreviousDraw;

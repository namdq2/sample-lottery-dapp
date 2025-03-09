import React from "react";
import TicketList from "./components/ticket-list";

const PreviousDraw = () => {
  return (
    <div className="bg-[#091818] border border-[#0d2925] rounded-lg p-5">
      <div className="font-bold mb-5 text-lg text-white">Previous Draws</div>

      <TicketList />
    </div>
  );
};

export default PreviousDraw;

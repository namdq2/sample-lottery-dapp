import React from "react";
import TicketList from "./components/ticket-list";

const PreviousDraw = () => {
  return (
    <div className="bg-white rounded-lg p-5">
      <div className="font-bold mb-5 text-lg">Previous Draws</div>

      <TicketList />
    </div>
  );
};

export default PreviousDraw;

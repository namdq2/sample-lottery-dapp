import React from "react";
import TicketIcon from "../../icons/ticket-icon";
import Profile from "../profile";

const Header = () => {
  return (
    <div className="border border-b-gray-200 h-fit flex justify-between py-2 px-14 bg-white">
      <div className="leading-8 font-extrabold text-xl flex items-center gap-1">
        <TicketIcon />
        <span>DLottery</span>
      </div>

      <Profile />
    </div>
  );
};

export default Header;

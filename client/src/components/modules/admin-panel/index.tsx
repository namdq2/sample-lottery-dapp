"use client";

import React from "react";
import CreateNewDraw from "./components/create-new-draw";
import { useDlottery } from "@/hooks";
import { useAccount } from "wagmi";

const AdminPanel = () => {
  const { currentOwner } = useDlottery();
  const { address } = useAccount();

  if (!currentOwner || currentOwner !== address) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-5">
      <div className="font-bold mb-5 text-lg">Admin Panel</div>

      <CreateNewDraw />
    </div>
  );
};

export default AdminPanel;

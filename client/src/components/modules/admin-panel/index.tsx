import React from "react";
import CreateNewDraw from "./components/create-new-draw";

const AdminPanel = () => {
  return (
    <div className="bg-[#091818] border border-[#0d2925] rounded-lg p-5">
      <div className="text-white font-bold mb-5 text-lg">Admin Panel</div>

      <CreateNewDraw />
    </div>
  );
};

export default AdminPanel;

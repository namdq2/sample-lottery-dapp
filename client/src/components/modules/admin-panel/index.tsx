import React from "react";
import CreateNewDraw from "./components/create-new-draw";

const AdminPanel = () => {
  return (
    <div className="bg-white rounded-lg p-5">
      <div className="font-bold mb-5 text-lg">Admin Panel</div>

      <CreateNewDraw />
    </div>
  );
};

export default AdminPanel;

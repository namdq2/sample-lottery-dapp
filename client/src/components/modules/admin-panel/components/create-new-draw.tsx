"use client";
import DateIcon from "@/components/icons/date-icon";
import TicketIcon from "@/components/icons/ticket-icon";
import UploadIcon from "@/components/icons/upload-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const CreateNewDraw = () => {
  const [isCreatingDraw, setIsCreatingDraw] = useState<boolean>(false);
  const { address } = useAccount();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button
          className="bg-[#091818] border border-[#036756] hover:bg-[#059669] w-32 h-32 whitespace-normal flex flex-col"
          disabled={!address || isCreatingDraw}
          onClick={() => {
            setIsCreatingDraw(true);
          }}
        >
          <TicketIcon/>
          New Lottery Draw
        </Button>

        {isCreatingDraw && (
          <>
            <Button className="bg-[#091818] border border-[#036756] hover:bg-[#059669] w-32 h-32 flex flex-col">
              <UploadIcon/>
              Upload Prize
            </Button>
            <Button
              className="bg-[#091818] border border-[#036756] hover:bg-[#059669] w-32 h-32 whitespace-normal flex flex-col"
              disabled
            >
              <DateIcon/>
              Set Date Next Draw
            </Button>
            <Button
              className="bg-[#091818] border border-[#036756] hover:bg-[#059669] w-32 h-32 flex flex-col"
              disabled
            >
              <TicketIcon/>
              Perform Draw
            </Button>
          </>
        )}
      </div>

      {isCreatingDraw && (
        <div className="flex gap-3 items-center">
          <Input
            className="w-44 text-white"
            type="number"
            min={0}
            step="0.01"
            defaultValue={0.01}
            placeholder="Prize amount in ETH"
          />
          <span className="text-gray-300 font-semibold">ETH</span>
        </div>
      )}
    </div>
  );
};

export default CreateNewDraw;

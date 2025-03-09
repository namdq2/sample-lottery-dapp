"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const CreateNewDraw = () => {
  const [isCreatingDraw, setIsCreatingDraw] = useState<boolean>(false);
  const { address } = useAccount();

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="bg-[#4f46e5] hover:bg-[#342db6] w-fit"
        disabled={!address || isCreatingDraw}
        onClick={() => {
          setIsCreatingDraw(true);
        }}
      >
        New Lottery Draw
      </Button>

      {isCreatingDraw && (
        <div>
          <div className="flex gap-3 mb-4 flex-wrap">
            <Button className="bg-[#059669] hover:bg-[#22755b]">
              Upload Prize
            </Button>
            <Button
              className="bg-gray-400 hover:bg-gray-600 text-gray-900"
              disabled
            >
              Set Date Next Draw
            </Button>
            <Button
              className="bg-gray-400 hover:bg-gray-600 text-gray-900"
              disabled
            >
              Perform Draw
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <Input
              className="w-44"
              type="number"
              min={0}
              step="0.01"
              defaultValue={0.01}
              placeholder="Prize amount in ETH"
            />
            <span className="text-gray-500 font-semibold">ETH</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewDraw;

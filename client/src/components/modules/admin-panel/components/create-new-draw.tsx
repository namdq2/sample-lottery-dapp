"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, use } from "react";
import { useAccount, useChainId } from "wagmi";
import { parseEther } from "viem";
import { useDlottery } from "@/hooks";
import DateIcon from "@/components/icons/date-icon";
import TicketIcon from "@/components/icons/ticket-icon";
import UploadIcon from "@/components/icons/upload-icon";

const CreateNewDraw = () => {
  const { address } = useAccount();
  const [isCreatingDraw, setIsCreatingDraw] = useState<boolean>(false);
  const [prize, setPrize] = useState<number>(0.01);
  const [drawTime, setDrawTime] = useState<string>("");
  const chainId = useChainId();
  const { currentOwner, currentDrawInfo } = useDlottery();

  const { uploadPrize, uploadPrizeData, uploadPrizeError, isUploadingPrize } =
    useDlottery();
  const { setDrawDate, setDrawDateData, setDrawDateError, isSettingDrawDate } =
    useDlottery();
  const { performDraw, performDrawData, performDrawError, isPerformingDraw } =
    useDlottery();

  const handleUploadPrize = async () => {
    try {
      console.log("uploadPrize", parseEther(prize.toString()));
      uploadPrize(parseEther(prize.toString()));
    } catch (error) {
      console.error("Error uploading prize:", error);
      alert("Failed to upload prize. See console for details.");
    }
  };

  const handleSetDrawTime = async () => {
    try {
      console.log("setDrawTime", drawTime);
      const drawTimeTimestamp = new Date(drawTime).getTime() / 1000;
      console.log("drawTimeTimestamp", drawTimeTimestamp);
      setDrawDate(drawTimeTimestamp);
    } catch (error) {
      console.error("Error setting draw time:", error);
      alert("Failed to set draw time. See console for details.");
    }
  };

  const handlePerformDraw = async () => {
    try {
      console.log("performDraw");
      performDraw();
    } catch (error) {
      console.error("Error performing draw:", error);
      alert("Failed to perform draw. See console for details.");
    }
  };

  useEffect(() => {
    if (performDrawData) {
      alert("Draw performed successfully!");
    }
    if (performDrawError) {
      console.error("Error performing draw:", performDrawError);
      alert("Failed to perform draw.");
    }
  }, [performDrawData, performDrawError]);

  useEffect(() => {
    if (setDrawDateData) {
      alert(`Draw date set at ${drawTime} successfully!`);
    }
    if (setDrawDateError) {
      console.error("Error setting draw date:", setDrawDateError);
      alert("Failed to set draw date.");
    }
  }, [setDrawDateData, setDrawDateError, drawTime]);

  useEffect(() => {
    if (uploadPrizeData) {
      alert(`Prize of ${prize} ETH uploaded successfully!`);
    }
    if (uploadPrizeError) {
      console.error("Error uploading prize:", uploadPrizeError);
      alert("Failed to upload prize to the contract.");
    }
  }, [uploadPrizeData, uploadPrizeError, prize]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          className="border border-[#4f46e5] bg-transparent hover:bg-[#342db6] w-32 h-32 whitespace-normal flex flex-col"
          disabled={!address || isCreatingDraw}
          onClick={() => {
            setIsCreatingDraw(true);
          }}
        >
          <TicketIcon />
          New Lottery Draw
        </Button>

        {isCreatingDraw && (
          <>
            <Button
              className="bg-transparent hover:bg-[#342db6] border border-[#4f46e5] w-32 h-32 flex flex-col"
              onClick={handleUploadPrize}
              disabled={
                isUploadingPrize ||
                !(
                  (!currentDrawInfo?.completed &&
                    Number(currentDrawInfo?.prize) == 0) ||
                  (currentDrawInfo?.completed &&
                    currentDrawInfo?.winner ==
                      "0x0000000000000000000000000000000000000000")
                )
              }
            >
              <UploadIcon />
              {isUploadingPrize ? "Uploading..." : "Upload Prize"}
            </Button>
            <Button
              className="bg-transparent hover:bg-[#342db6] border border-[#4f46e5] w-32 h-32 whitespace-normal flex flex-col"
              onClick={handleSetDrawTime}
              disabled={
                isSettingDrawDate ||
                !(
                  !currentDrawInfo?.completed &&
                  Number(currentDrawInfo?.prize) > 0 &&
                  currentDrawInfo?.drawTime === null
                )
              }
            >
              <DateIcon />
              Set Date Next Draw
            </Button>
            <Button
              className="bg-transparent hover:bg-[#342db6] border border-[#4f46e5] w-32 h-32 flex flex-col"
              onClick={handlePerformDraw}
              disabled={
                isPerformingDraw ||
                !(
                  !currentDrawInfo?.completed &&
                  Number(currentDrawInfo?.prize) > 0 &&
                  (currentDrawInfo?.drawTime?.getTime() || 0) < Date.now()
                )
              }
            >
              <TicketIcon />
              Perform Draw
            </Button>
          </>
        )}
      </div>

      {!(
        !currentDrawInfo?.completed && Number(currentDrawInfo?.prize) >= 0
      ) && (
        <div className="flex gap-3 items-center">
          <Input
            className="w-44 text-white"
            type="number"
            min={0}
            value={prize}
            step={0.01}
            onChange={(e) => setPrize(parseFloat(e.target.value))}
            placeholder="Prize amount in ETH"
          />
          <span className="text-gray-500 font-semibold">ETH</span>
        </div>
      )}

      {!(
        !currentDrawInfo?.completed &&
        Number(currentDrawInfo?.prize) > 0 &&
        currentDrawInfo?.drawTime !== null
      ) && (
        <div className="flex gap-3 items-center">
          <Input
            className="w-50 text-white date-icon-input-white "
            type="datetime-local"
            onChange={(e) => setDrawTime(e.target.value)}
            value={drawTime}
          />
        </div>
      )}
    </div>
  );
};

export default CreateNewDraw;

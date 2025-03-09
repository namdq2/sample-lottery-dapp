"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, use } from "react";
import { useAccount, useChainId } from "wagmi";
import { parseEther } from "viem";
import { useDlottery } from "@/hooks";

const CreateNewDraw = () => {
  const { address } = useAccount();
  const [isCreatingDraw, setIsCreatingDraw] = useState<boolean>(false);
  const [prize, setPrize] = useState<number>(0.01);
  const [drawTime, setDrawTime] = useState<string>("");
  const chainId = useChainId();
  const { currentOwner, currentDrawInfo } = useDlottery();

  console.log("currentOwner", currentOwner);
  console.log("chainId", chainId);
  console.log("currentDrawInfo", currentDrawInfo);
  console.log("prize", prize);
  console.log("drawTime", drawTime);
  console.log("drawTimeTimestamp", new Date(drawTime).getTime() / 1000);

  const { uploadPrize, uploadPrizeData, uploadPrizeError, isUploadingPrize } =
    useDlottery();
  const { setDrawDate, setDrawDateData, setDrawDateError, isSettingDrawDate } =
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
            <Button
              className="bg-[#059669] hover:bg-[#22755b]"
              onClick={handleUploadPrize}
              disabled={
                isUploadingPrize ||
                (!currentDrawInfo?.completed &&
                  Number(currentDrawInfo?.prize) >= 0)
              }
            >
              {isUploadingPrize ? "Uploading..." : "Upload Prize"}
            </Button>
            <Button
              className="bg-gray-400 hover:bg-gray-600 text-gray-900"
              onClick={handleSetDrawTime}
              disabled={
                isSettingDrawDate ||
                (!currentDrawInfo?.completed &&
                  Number(currentDrawInfo?.prize) > 0 &&
                  currentDrawInfo?.drawTime !== null)
              }
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

          {!(
            !currentDrawInfo?.completed && Number(currentDrawInfo?.prize) >= 0
          ) && (
            <div className="flex gap-3 items-center">
              <Input
                className="w-44"
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
                className="w-50"
                type="datetime-local"
                onChange={(e) => setDrawTime(e.target.value)}
                value={drawTime}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateNewDraw;

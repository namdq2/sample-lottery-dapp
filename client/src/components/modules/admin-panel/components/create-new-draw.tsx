"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, {useState, useEffect, useRef} from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useDlottery } from "@/hooks";
import DateIcon from "@/components/icons/date-icon";
import TicketIcon from "@/components/icons/ticket-icon";
import UploadIcon from "@/components/icons/upload-icon";
import { useToast } from "@/components/context/toast-context";

const CreateNewDraw = () => {
  const { address } = useAccount();
  const { currentDrawInfo } = useDlottery();
  const [isCreatingDraw, setIsCreatingDraw] = useState<boolean>(false);
  const [prize, setPrize] = useState<number>(0.01);
  const [drawTime, setDrawTime] = useState<string>("");
  const { showToast } = useToast();

  const { uploadPrize, uploadPrizeData, uploadPrizeError, isUploadingPrize } =
    useDlottery();
  const { setDrawDate, setDrawDateData, setDrawDateError, isSettingDrawDate } =
    useDlottery();
  const { performDraw, performDrawData, performDrawError, isPerformingDraw } =
    useDlottery();

  // Add at the top of your component:
  const prevUploadPrizeData = useRef(null);
  const prevUploadPrizeError = useRef(null);
  const prevSetDrawDateData = useRef(null);
  const prevSetDrawDateError = useRef(null);
  const prevPerformDrawData = useRef(null);
  const prevPerformDrawError = useRef(null);

  const handleUploadPrize = async () => {
    try {
      uploadPrize(parseEther(prize.toString()));
    } catch (error) {
      console.error("Error uploading prize:", error);
      showToast(
        "Upload Failed",
        "error",
        "Failed to upload prize. See console for details."
      );
    }
  };

  const handleSetDrawTime = async () => {
    try {
      const drawTimeTimestamp = new Date(drawTime).getTime() / 1000;
      setDrawDate(drawTimeTimestamp);
    } catch (error) {
      console.error("Error setting draw time:", error);
      showToast(
        "Date Setup Failed",
        "error",
        "Failed to set draw time. See console for details."
      );
    }
  };

  const handlePerformDraw = async () => {
    try {
      performDraw();
    } catch (error) {
      console.error("Error performing draw:", error);
      showToast(
        "Draw Failed",
        "error",
        "Failed to perform draw. See console for details."
      );
    }
  };

  // Handle transaction feedback with toasts
  useEffect(() => {
    if (performDrawData)
      showToast(
        "Draw Successful",
        "success",
        "The lottery draw has been performed successfully!"
      );
    if (performDrawError)
      showToast(
        "Draw Failed",
        "error",
        "There was an error while performing the draw."
      );
  }, [performDrawData, performDrawError, showToast]);

  useEffect(() => {
    if (setDrawDateData)
      showToast(
        "Date Set",
        "success",
        `Draw date set at ${drawTime} successfully!`
      );
    if (setDrawDateError)
      showToast(
        "Date Setup Failed",
        "error",
        "There was an error while setting the draw date."
      );
  }, [setDrawDateData, setDrawDateError, drawTime, showToast]);

  // This pattern could cause the infinite loop:
  useEffect(() => {
    // Only show toast when these values change from null/undefined to a value
    if (uploadPrizeData && !prevUploadPrizeData.current) {
      showToast(
        "Prize Uploaded",
        "success",
        `Prize of ${prize} ETH uploaded successfully!`
      );
      prevUploadPrizeData.current = uploadPrizeData;
    }

    if (uploadPrizeError && !prevUploadPrizeError.current) {
      showToast(
        "Prize Upload Failed",
        "error",
        "There was an error while uploading the prize to the contract."
      );
      prevUploadPrizeError.current = uploadPrizeError;
    }
  }, [uploadPrizeData, uploadPrizeError, prize, showToast]);

  // Can upload prize when: Prize is 0 or there's a completed draw with no winner
  const canUploadPrize =
    !isUploadingPrize &&
    ((!currentDrawInfo?.completed && Number(currentDrawInfo?.prize) === 0) ||
      (currentDrawInfo?.completed &&
        currentDrawInfo?.winner ===
          "0x0000000000000000000000000000000000000000"));

  // Can set draw date when: Draw is not completed, prize is set, but draw time is not set
  const canSetDrawDate =
    !isSettingDrawDate &&
    !currentDrawInfo?.completed &&
    Number(currentDrawInfo?.prize) > 0 &&
    currentDrawInfo?.drawTime === null;

  // Can perform draw when: Draw is not completed, prize is set, and current time is past draw time
  const canPerformDraw =
    !isPerformingDraw &&
    !currentDrawInfo?.completed &&
    Number(currentDrawInfo?.prize) > 0 &&
    (currentDrawInfo?.drawTime?.getTime() || 0) < Date.now();

  // Need to show prize input
  const showPrizeInput = !(
    !currentDrawInfo?.completed && Number(currentDrawInfo?.prize) >= 0
  );

  // Need to show date input
  const showDateInput = !(
    !currentDrawInfo?.completed &&
    Number(currentDrawInfo?.prize) > 0 &&
    currentDrawInfo?.drawTime !== null
  );

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        Lottery Administration
      </h3>

      {!isCreatingDraw ? (
        <div className="flex justify-center">
          <Button
            className="border-2 border-[#6366F1] bg-[#1E293B] hover:bg-[#6366F1]/20 w-40 h-40 whitespace-normal flex flex-col gap-3 items-center justify-center rounded-xl shadow-lg shadow-[#6366F1]/10 text-white font-medium transition-all"
            disabled={!address}
            onClick={() => setIsCreatingDraw(true)}
          >
            <div className="text-[#6366F1] text-2xl">
              <TicketIcon />
            </div>
            <span>Create New Lottery Draw</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              className={`border-2 ${
                canUploadPrize ? "border-[#10B981]" : "border-gray-600"
              }
                bg-[#1E293B] hover:bg-[#10B981]/20 w-full md:w-32 h-32 flex flex-col items-center
                justify-center gap-3 rounded-xl shadow-lg shadow-[#10B981]/10 text-white
                font-medium transition-all ${!canUploadPrize && "opacity-50"}`}
              onClick={handleUploadPrize}
              disabled={!canUploadPrize}
            >
              <div
                className={`text-xl ${
                  canUploadPrize ? "text-[#10B981]" : "text-gray-400"
                }`}
              >
                <UploadIcon />
              </div>
              {isUploadingPrize ? "Uploading..." : "Upload Prize"}
            </Button>

            <Button
              className={`border-2 ${
                canSetDrawDate ? "border-[#FBBF24]" : "border-gray-600"
              }
                bg-[#1E293B] hover:bg-[#FBBF24]/20 w-full md:w-32 h-32 whitespace-normal
                flex flex-col items-center justify-center gap-3 rounded-xl shadow-lg
                shadow-[#FBBF24]/10 text-white font-medium transition-all ${
                  !canSetDrawDate && "opacity-50"
                }`}
              onClick={handleSetDrawTime}
              disabled={!canSetDrawDate}
            >
              <div
                className={`text-xl ${
                  canSetDrawDate ? "text-[#FBBF24]" : "text-gray-400"
                }`}
              >
                <DateIcon />
              </div>
              Set Draw Date
            </Button>

            <Button
              className={`border-2 ${
                canPerformDraw ? "border-[#F43F5E]" : "border-gray-600"
              }
                bg-[#1E293B] hover:bg-[#F43F5E]/20 w-full md:w-32 h-32 flex flex-col items-center
                justify-center gap-3 rounded-xl shadow-lg shadow-[#F43F5E]/10 text-white
                font-medium transition-all ${!canPerformDraw && "opacity-50"}`}
              onClick={handlePerformDraw}
              disabled={!canPerformDraw}
            >
              <div
                className={`text-xl ${
                  canPerformDraw ? "text-[#F43F5E]" : "text-gray-400"
                }`}
              >
                <TicketIcon />
              </div>
              Perform Draw
            </Button>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {showPrizeInput && (
              <div className="flex gap-3 items-center bg-[#0A0F1E] p-3 rounded-lg w-full sm:w-auto">
                <Input
                  className="bg-transparent border-gray-700 text-white focus-visible:ring-[#6366F1]"
                  type="number"
                  min={0}
                  value={prize}
                  step={0.01}
                  onChange={(e) => setPrize(parseFloat(e.target.value))}
                  placeholder="Prize amount"
                />
                <span className="text-[#6366F1] font-semibold whitespace-nowrap">
                  ETH
                </span>
              </div>
            )}

            {showDateInput && (
              <div className="bg-[#0A0F1E] p-3 rounded-lg w-full sm:w-auto">
                <Input
                  className="bg-transparent border-gray-700 text-white focus-visible:ring-[#6366F1]"
                  type="datetime-local"
                  onChange={(e) => setDrawTime(e.target.value)}
                  value={drawTime}
                />
              </div>
            )}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              onClick={() => setIsCreatingDraw(false)}
              className="text-gray-400 hover:text-white hover:bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewDraw;

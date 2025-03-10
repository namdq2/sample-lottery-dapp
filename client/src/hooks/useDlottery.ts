"use client";

import { useCallback } from "react";
import {
  DLOTTERY_ABI,
  DLOTTERY_CONTRACT_ADDRESSES,
} from "../constants/contracts";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { formatEther } from "viem";

// Type for the draw information returned by getCurrentDrawInfo
export type DrawInfo = {
  drawId: number;
  prize: string;
  drawTime: Date | null;
  completed: boolean;
  winner: `0x${string}`;
};

export function useDlottery() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();

  // Get contract address for current chain
  const contractAddress =
    DLOTTERY_CONTRACT_ADDRESSES[chainId] || DLOTTERY_CONTRACT_ADDRESSES[1]; // Default to mainnet if not found

  // Read functions
  const { data: currentOwnerData } = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "owner",
  });

  const currentOwner = currentOwnerData ? currentOwnerData : null;

  const { data: drawData } = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "getCurrentDrawInfo",
  });

  // Process draw info data
  const currentDrawInfo = drawData
    ? {
        drawId: Number(drawData[0]),
        prize: formatEther(BigInt(drawData[1] || 0)),
        drawTime: drawData[2] > 0 ? new Date(Number(drawData[2]) * 1000) : null,
        completed: drawData[3] || false,
        winner: drawData[4] || "0x0000000000000000000000000000000000000000",
      }
    : null;

  const { data: remainingTicketsData } = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "getRemainingTickets",
  });

  const remainingTickets = remainingTicketsData
    ? Number(remainingTicketsData)
    : 0;

  // Write functions with reset functions
  const {
    writeContract: participateWrite,
    data: participateData,
    isPending: isParticipating,
    error: participateError,
    reset: resetParticipate, // Added reset function
  } = useWriteContract();

  const {
    writeContract: uploadPrizeWrite,
    data: uploadPrizeData,
    isPending: isUploadingPrize,
    error: uploadPrizeError,
    reset: resetUploadPrize, // Added reset function
  } = useWriteContract();

  const {
    writeContract: withdrawPrizeWrite,
    data: withdrawPrizeData,
    isPending: isWithdrawingPrize,
    error: withdrawPrizeError,
    reset: resetWithdrawPrize, // Added reset function
  } = useWriteContract();

  const {
    writeContract: performDrawWrite,
    data: performDrawData,
    isPending: isPerformingDraw,
    error: performDrawError,
    reset: resetPerformDraw, // Added reset function
  } = useWriteContract();

  const {
    writeContract: setDrawDateWrite,
    data: setDrawDateData,
    isPending: isSettingDrawDate,
    error: setDrawDateError,
    reset: resetSetDrawDate, // Added reset function
  } = useWriteContract();

  // Function wrappers for write functions
  const participate = () => {
    participateWrite({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "participate",
    });
  };

  const uploadPrize = async (amount: bigint) => {
    try {
      return await uploadPrizeWrite({
        address: contractAddress,
        abi: DLOTTERY_ABI,
        functionName: "uploadPrize",
        value: amount,
      });
    } catch (error) {
      console.error("Error uploading prize:", error);
      console.debug("Transaction details:", {
        contractAddress,
        functionName: "uploadPrize",
        value: amount.toString(),
        chainId,
      });
      throw error;
    }
  };

  const withdrawPrize = () => {
    withdrawPrizeWrite({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "withdrawPrize",
    });
  };

  const performDraw = () => {
    performDrawWrite({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "performDraw",
    });
  };

  const setDrawDate = (timestamp: number) => {
    setDrawDateWrite({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "setDrawDate",
      args: [BigInt(timestamp)],
    });
  };

  // Add resetTransactions function to clear all transaction states
  const resetTransactions = useCallback(() => {
    if (resetParticipate) resetParticipate();
    if (resetUploadPrize) resetUploadPrize();
    if (resetWithdrawPrize) resetWithdrawPrize();
    if (resetPerformDraw) resetPerformDraw();
    if (resetSetDrawDate) resetSetDrawDate();
  }, [
    resetParticipate,
    resetUploadPrize,
    resetWithdrawPrize,
    resetPerformDraw,
    resetSetDrawDate,
  ]);

  return {
    contractAddress,
    // Read functions
    currentOwner,
    currentDrawInfo,
    remainingTickets,
    // Write functions
    participate,
    isParticipating,
    participateData,
    participateError,

    uploadPrize,
    isUploadingPrize,
    uploadPrizeData,
    uploadPrizeError,

    withdrawPrize,
    isWithdrawingPrize,
    withdrawPrizeData,
    withdrawPrizeError,

    performDraw,
    isPerformingDraw,
    performDrawData,
    performDrawError,

    setDrawDate,
    isSettingDrawDate,
    setDrawDateData,
    setDrawDateError,

    // Add the reset function to the returned object
    resetTransactions,
  };
}

// Export types
export type DlotteryHook = ReturnType<typeof useDlottery>;

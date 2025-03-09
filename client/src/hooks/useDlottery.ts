"use client";

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
  drawId: bigint;
  prize: bigint;
  drawTime: bigint;
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

  const remainingTickets = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "getRemainingTickets",
  });

  const ticketInfo = (ticketId: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "getTicketInfo",
      args: [ticketId],
    });
  };

  const userRegistered = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "isRegistered",
    args: [userAddress as `0x${string}`],
  });

  const checkRegistration = (address: `0x${string}`) => {
    return useReadContract({
      address: contractAddress,
      abi: DLOTTERY_ABI,
      functionName: "isRegistered",
      args: [address],
    });
  };

  const paused = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "paused",
  });

  // Write functions
  const {
    writeContract: participateWrite,
    data: participateData,
    isPending: isParticipating,
    error: participateError,
  } = useWriteContract();

  const {
    writeContract: uploadPrizeWrite,
    data: uploadPrizeData,
    isPending: isUploadingPrize,
    error: uploadPrizeError,
  } = useWriteContract();

  const {
    writeContract: withdrawPrizeWrite,
    data: withdrawPrizeData,
    isPending: isWithdrawingPrize,
    error: withdrawPrizeError,
  } = useWriteContract();

  const {
    writeContract: performDrawWrite,
    data: performDrawData,
    isPending: isPerformingDraw,
    error: performDrawError,
  } = useWriteContract();

  const {
    writeContract: setDrawDateWrite,
    data: setDrawDateData,
    isPending: isSettingDrawDate,
    error: setDrawDateError,
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
      // Let's remove the explicit gas limit and use better error handling
      return await uploadPrizeWrite({
        address: contractAddress,
        abi: DLOTTERY_ABI,
        functionName: "uploadPrize",
        value: amount,
        // Remove the explicit gas limit to let the provider estimate it
      });
    } catch (error) {
      // Improved error logging
      console.error("Error uploading prize:", error);

      // Log more details about the transaction attempt
      console.debug("Transaction details:", {
        contractAddress,
        functionName: "uploadPrize",
        value: amount.toString(),
        chainId,
      });

      throw error;
    }
  };

  //   const uploadPrize = (amount: bigint) => {
  //     uploadPrizeWrite({
  //       address: contractAddress,
  //       abi: DLOTTERY_ABI,
  //       functionName: 'uploadPrize',
  //       value: amount,
  //     });
  //   };

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

  return {
    contractAddress,
    // Read functions
    currentOwner,
    currentDrawInfo,
    remainingTickets,
    ticketInfo,
    userRegistered,
    checkRegistration,
    paused,
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
  };
}

// Export types
export type DlotteryHook = ReturnType<typeof useDlottery>;

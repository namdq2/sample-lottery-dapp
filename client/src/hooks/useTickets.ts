"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useReadContract } from "wagmi";
import { useDlottery } from "./useDlottery";
import { DLOTTERY_ABI } from "@/constants/contracts";

export type TicketInfo = {
  ticketId: bigint;
  owner: `0x${string}`;
  formattedOwner: string; // Shortened address for UI
};

// Format address helper - moved outside component to prevent recreation on each render
const formatAddress = (address: `0x${string}` | null | undefined): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export function useTickets() {
  const { contractAddress } = useDlottery();
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Read tickets data from contract
  const {
    data: paidTicketsData,
    isLoading: isContractLoading,
    isError,
    error: contractError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "getPaidTickets",
    // Only fetch if we have a contract address
    enabled: !!contractAddress,
  });

  // Memoized refresh function
  const refreshTickets = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  // Process contract data using useEffect
  useEffect(() => {
    // Handle error state
    if (isError && contractError) {
      setError(
        contractError instanceof Error
          ? contractError
          : new Error("Unknown contract error")
      );
      setIsLoading(false);
      return;
    }

    // Process data when available
    if (!isContractLoading && paidTicketsData) {
      try {
        const ticketIds =
          Array.isArray(paidTicketsData) && paidTicketsData[0]
            ? (paidTicketsData[0] as bigint[])
            : [];

        const owners =
          Array.isArray(paidTicketsData) && paidTicketsData[1]
            ? (paidTicketsData[1] as `0x${string}`[])
            : [];

        // Create formatted ticket objects
        const formattedTickets = ticketIds.map((ticketId, index) => ({
          ticketId,
          owner: owners[index],
          formattedOwner: formatAddress(owners[index]),
        }));

        setTickets(formattedTickets);
        setError(null);
      } catch (err) {
        console.error("Error processing ticket data:", err);
        setError(
          err instanceof Error ? err : new Error("Error processing ticket data")
        );
      } finally {
        setIsLoading(false);
      }
    }
  }, [paidTicketsData, isContractLoading, isError, contractError]);

  // Compute derived values using useMemo
  const isEmpty = useMemo(
    () => !isLoading && tickets.length === 0,
    [isLoading, tickets.length]
  );

  // Return stable object reference with useMemo
  return useMemo(
    () => ({
      tickets,
      isLoading: isLoading || isContractLoading,
      error,
      isEmpty,
      refreshTickets,
    }),
    [tickets, isLoading, isContractLoading, error, isEmpty, refreshTickets]
  );
}

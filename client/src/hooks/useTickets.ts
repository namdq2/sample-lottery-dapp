"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useDlottery } from "./useDlottery";
import { DLOTTERY_ABI } from "@/constants/contracts";

export type TicketInfo = {
  ticketId: bigint;
  owner: `0x${string}`;
  formattedOwner: string; // Shortened address for UI
};

export function useTickets() {
  const { contractAddress } = useDlottery();
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: paidTicketsData, isLoading: isContractLoading, isError, error: contractError } = useReadContract({
    address: contractAddress,
    abi: DLOTTERY_ABI,
    functionName: "getPaidTickets",
  });

  // Format address helper
  const formatAddress = (address: `0x${string}`): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    if (isError && contractError) {
      setError(contractError);
      setIsLoading(false);
      return;
    }

    if (!isContractLoading && paidTicketsData) {
      try {
        const ticketIds = paidTicketsData[0] as bigint[];
        const owners = paidTicketsData[1] as `0x${string}`[];
        
        const formattedTickets = ticketIds?.map((ticketId, index) => ({
          ticketId,
          owner: owners[index],
          formattedOwner: formatAddress(owners[index])
        })) || [];
        
        setTickets(formattedTickets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error processing ticket data'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [paidTicketsData, isContractLoading, isError, contractError]);

  return {
    tickets,
    isLoading: isLoading || isContractLoading,
    error,
    isEmpty: !isLoading && tickets.length === 0
  };
}
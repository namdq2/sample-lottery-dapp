"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useTickets } from "@/hooks";

const TicketList = () => {
  const { tickets, isLoading, error, isEmpty } = useTickets();

  // Loading state with animation
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-300">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-[#6366F1] border-r-[#6366F1] border-b-transparent border-l-transparent mb-2"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  // Error state with better styling
  if (error) {
    return (
      <div className="text-center py-6 px-4 rounded-lg bg-[#1E293B] border border-[#F43F5E]/30">
        <p className="text-[#F43F5E] mb-1 font-medium">Failed to load tickets</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  // Empty state with better styling
  if (isEmpty) {
    return (
      <div className="text-center py-8 px-4 rounded-lg bg-[#1E293B] border border-[#6366F1]/20">
        <p className="text-white mb-2">No tickets purchased yet</p>
        <p className="text-sm text-gray-400">Be the first to participate in this draw!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-[#1E293B] bg-[#0A0F1E]/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1E293B] border-b border-b-[#0A0F1E]">
              <TableHead className="w-[100px] text-white font-semibold">TICKET</TableHead>
              <TableHead className="text-right text-white font-semibold">WALLET ADDRESS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket, idx) => (
              <TableRow 
                key={ticket.ticketId.toString()}
                className={idx % 2 === 0 ? 'bg-[#141B33]/30' : 'bg-[#0A0F1E]/80'}
              >
                <TableCell className="font-medium text-[#6366F1]">
                  #{ticket.ticketId.toString()}
                </TableCell>
                <TableCell className="text-right text-gray-300 font-mono truncate max-w-[180px] md:max-w-none">
                  {ticket.formattedOwner}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketList;
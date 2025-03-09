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

  if (isLoading) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load tickets: {error.message}</div>;
  }

  if (isEmpty) {
    return <div className="text-center py-4">No tickets purchased yet</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-white">TICKET</TableHead>
          <TableHead className="text-right text-white">WALLET ADDRESS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.ticketId.toString()}>
            <TableCell className="font-medium text-white">{ticket.ticketId.toString()}</TableCell>
            <TableCell className="text-right text-white">{ticket.formattedOwner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketList;

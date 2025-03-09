import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const tickets = [
  {
    ticketId: "INV001",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV002",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV003",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV004",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV005",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV006",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
  {
    ticketId: "INV007",
    walletAddress: "CJKASGHIU&^%!@JK!KDJ6565",
  },
];

const TicketList = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">TICKET</TableHead>
          <TableHead className="text-right">WALLET ADDRESS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.ticketId}>
            <TableCell className="font-medium">{ticket.ticketId}</TableCell>
            <TableCell className="text-right">{ticket.walletAddress}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketList;

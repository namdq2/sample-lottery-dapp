import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const lotteryData = [
  {
    id: "#1234",
    date: "March 10, 2025",
    prize: "0.01 ETH",
    winner: "0x1234...5678",
  },
  {
    id: "#1235",
    date: "March 11, 2025",
    prize: "0.02 ETH",
    winner: "0x2345...6789",
  },
  {
    id: "#1236",
    date: "March 12, 2025",
    prize: "0.05 ETH",
    winner: "0x3456...7890",
  },
  {
    id: "#1237",
    date: "March 13, 2025",
    prize: "0.03 ETH",
    winner: "0x4567...8901",
  },
  {
    id: "#1238",
    date: "March 14, 2025",
    prize: "0.01 ETH",
    winner: "0x5678...9012",
  },
];

const TicketList = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white w-[100px]">DRAW ID</TableHead>
          <TableHead className="text-white text-right">DATEW</TableHead>
          <TableHead className="text-white text-right">PRIZE</TableHead>
          <TableHead className="text-white text-right">WINNER</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lotteryData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="text-white font-medium">{item.id}</TableCell>
            <TableCell className="text-white text-right">{item.date}</TableCell>
            <TableCell className="text-white text-right">{item.prize}</TableCell>
            <TableCell className="text-white text-right">{item.winner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketList;

import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletList = () => {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <div className="mb-3">Connected to {connector?.name}</div>
        <Button className="w-full" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  if (error) {
    toast(error.message);
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <Button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </Button>
      ))}
    </div>
  );
};

export default WalletList;

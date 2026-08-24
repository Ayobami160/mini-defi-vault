"use client";

import { useEffect, useState } from "react";
import { connectWallet } from "@/lib/web3";

export default function WalletConnect() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // Connect wallet
    const handleConnectWallet = async () => {
        try {
            setLoading(true);
            const { address } = await connectWallet();
            setAddress(address);
        } catch (error) {
            console.error(error);
            alert("Failed to connect wallet. Please make sure you have MetaMask installed and try again.");
        } finally {
            setLoading(false);
        }
    };

    // Disconnect wallet
    const handleDisconnectWallet = () => {
        setAddress("");
    };

    useEffect(() => {
        if (typeof window === "undefined" || !window.ethereum) return;

        // Check if wallet is already connected
        window.ethereum.request({ method: "eth_accounts" }).then((accounts: any[]) => {
            if (accounts.length > 0) {
                setAddress(accounts[0]);
            }
        });

        // Listen for account changes
        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            if (accounts.length === 0) {
                setAddress("");
            } else {
                setAddress(accounts[0]);
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        };
    }, []);

    return (
        <div className="flex items-center gap-3">
            {address ? (
                <>
                    <span className="rounded bg-gray-100 px-3 py-2 text-sm">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                    <button
                        onClick={handleDisconnectWallet}
                        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={handleConnectWallet}
                    disabled={loading}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Connecting..." : "Connect Wallet"}
                </button>
            )}
        </div>
    );
}
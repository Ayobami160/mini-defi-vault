"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getVaultReadContract } from "@/lib/contracts";

export default function VaultBalance() {
    const [balance, setBalance] = useState("0.00");
    const [loading, setLoading] = useState(true);

    const loadBalance = async () => {
        try {
            setLoading(true);
            const contract = getVaultReadContract();
            
            // Replaced 0n with BigInt(0) to support lower TS targets
            const rawBalance = await contract.contractBalance?.() ?? await contract.getBalance?.() ?? BigInt(0);
            
            if (rawBalance !== null && rawBalance !== undefined) {
                setBalance(ethers.formatEther(rawBalance));
            } else {
                setBalance("0.00");
            }
        } catch (err) {
            console.error("Error loading vault balance:", err);
            setBalance("0.00");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBalance();
    }, []);

    return (
        <div className="rounded-lg border p-6 shadow-md bg-white">
            <h2 className="text-xl font-bold mb-2">Vault Balance</h2>
            <p className="text-3xl font-semibold">
                {loading ? "Loading..." : `${balance} ETH`}
            </p>
            <button 
                onClick={loadBalance}
                className="mt-4 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            >
                Refresh
            </button>
        </div>
    );
}
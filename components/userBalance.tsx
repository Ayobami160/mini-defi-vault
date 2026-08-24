"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getVaultReadContract } from "@/lib/contracts";
import { getProvider } from "@/lib/web3";

export default function UserBalance() {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("0");
    const [loading, setLoading] = useState(true);

    const loadUserBalance = async () => {
        try {
            const provider = await getProvider();
            const accounts = await provider.send("eth_accounts", []);
            if (accounts.length === 0) {
                setLoading(false);
                return;
            }
            const userAddress = accounts[0];
            setAddress(userAddress);
            const contract = await getVaultReadContract();
            const userBalance = await contract.getBalance(userAddress);
            setBalance(ethers.formatEther(userBalance));
        } catch (error) {
            console.error("error loading user balance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserBalance();
        // Refresh every 10 seconds
        const interval = setInterval(loadUserBalance, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-lg border bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-bold">
                My Vault Balance
            </h2>
            {loading ? (
                <p>loading...</p>
            ) : (
                <>
                    <p className="mb-2 text-sm text-gray-500">
                        Wallet:
                    </p>
                    <p className="mb-2 break-all text-sm font-mono">{address}</p>
                    <p className="text-4xl font-bold text-green-600">
                        {Number(balance).toFixed(4)} ETH
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Your deposited ETH
                    </p>
                    <button 
                        onClick={loadUserBalance} 
                        className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        Refresh
                    </button>
                </>
            )}
        </div>
    );
}
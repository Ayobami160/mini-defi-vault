"use client";

import { useEffect, useState } from "react";
import { ethers, EventLog } from "ethers";
import { getVaultReadContract } from "@/lib/contracts";

interface Transaction {
    type: "Deposit" | "Withdraw";
    user: string;
    amount: string;
    txHash: string;
}

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let contract: ethers.Contract;
        let isMounted = true;

        async function loadEvents() {
            try {
                contract = await getVaultReadContract();
                const provider = contract.runner as ethers.Provider;
                const latestBlock = await provider.getBlockNumber();
                
                // Query only the recent 2000 blocks to prevent RPC rate-limit errors (Too Many Requests)
                const from = Math.max(0, latestBlock - 2000);
                const to = latestBlock;

                const [depositLogs, withdrawLogs] = await Promise.all([
                    contract.queryFilter(contract.filters.Deposited(), from, to),
                    contract.queryFilter(contract.filters.Withdrawn(), from, to)
                ]);

                const history: Transaction[] = [];

                for (const log of depositLogs) {
                    const event = log as EventLog;
                    history.push({
                        type: "Deposit",
                        user: event.args?.[0] || "Unknown",
                        amount: ethers.formatEther(event.args?.[1] || 0),
                        txHash: event.transactionHash,
                    });
                }

                for (const log of withdrawLogs) {
                    const event = log as EventLog;
                    history.push({
                        type: "Withdraw",
                        user: event.args?.[0] || "Unknown",
                        amount: ethers.formatEther(event.args?.[1] || 0),
                        txHash: event.transactionHash,
                    });
                }

                // Sort transactions newest first based on block number / hash order
                history.sort((a, b) => b.txHash.localeCompare(a.txHash));

                if (isMounted) {
                    setTransactions(history);
                }

                // Setup live event listeners for real-time updates
                contract.on("Deposited", (user, amount, event) => {
                    if (!isMounted) return;
                    setTransactions((prev) => [
                        {
                            type: "Deposit",
                            user,
                            amount: ethers.formatEther(amount),
                            txHash: event.log.transactionHash,
                        },
                        ...prev,
                    ]);
                });

                contract.on("Withdrawn", (user, amount, event) => {
                    if (!isMounted) return;
                    setTransactions((prev) => [
                        {
                            type: "Withdraw",
                            user,
                            amount: ethers.formatEther(amount),
                            txHash: event.log.transactionHash,
                        },
                        ...prev,
                    ]);
                });
            } catch (err) {
                console.error("Error loading transaction history:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadEvents();

        return () => {
            isMounted = false;
            if (contract) {
                contract.removeAllListeners("Deposited");
                contract.removeAllListeners("Withdrawn");
            }
        };
    }, []);

    return (
        <div className="rounded-lg border bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>
            {loading ? (
                <p className="text-gray-500">Loading transactions...</p>
            ) : transactions.length === 0 ? (
                <p className="text-gray-500">No recent transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tx, index) => (
                        <div key={`${tx.txHash}-${index}`} className="rounded border p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold ${tx.type === "Deposit" ? "text-green-600" : "text-red-600"}`}>
                                    {tx.type}
                                </span>
                                <span className="font-semibold">{tx.amount} ETH</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-700 break-all">
                                <span className="font-medium">Wallet:</span> {tx.user}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 break-all">
                                <span className="font-medium">Tx:</span> {tx.txHash}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
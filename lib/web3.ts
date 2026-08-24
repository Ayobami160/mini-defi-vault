"use client";

import { ethers } from "ethers";

// Tell TypeScript that window can have an ethereum property
declare global {
    interface Window {
        ethereum?: any;
    }
}

export const SEPOLA_CHAIN_ID = "0xaa36a7";

export async function getProvider(): Promise<ethers.BrowserProvider> {
    if (typeof window === "undefined") {
        throw new Error("Window is not available.");
    }
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }
    return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner> {
    const provider = await getProvider();
    const accounts = await provider.send("eth_accounts", []);
    if (!accounts || accounts.length === 0) {
        throw new Error("Wallet is not connected.");
    }
    return await provider.getSigner();
}

export async function connectWallet(): Promise<{
    provider: ethers.BrowserProvider;
    signer: ethers.JsonRpcSigner;
    address: string;
}> {
    if (typeof window === "undefined") {
        throw new Error("Window is not available.");
    }
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    const provider = await getProvider();

    // Switch to the Sepolia network
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLA_CHAIN_ID }],
    });

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
        provider,
        signer,
        address,
    };
}
import { ethers } from "ethers";
import { getSigner } from "./web3";
import VaultArtifacts from "../contracts/out/vault.sol/vault.json" with { type: "json" };

const contractAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS!;
const SEPOLIA_CHAIN_ID = 11155111;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);

const artifact = VaultArtifacts as unknown as { abi: any };

export function getVaultReadContract() {
  return new ethers.Contract(
    contractAddress,
    artifact.abi,
    provider
  );
}

export async function getVaultWriteContract() {
  const signer = await getSigner();
  const network = await signer.provider!.getNetwork();

  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch Metamask to Sepolia.");
  }

  return new ethers.Contract(
    contractAddress,
    artifact.abi,
    signer
  );
}
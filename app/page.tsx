import Navbar from "@/components/Navbar";
import VaultBalance from "@/components/VaultBalance";
import UserBalance from "@/components/userBalance";
import Deposit from "@/components/Deposit";
import Withdraw from "@/components/withdraw";
import TransactionHistory from "@/components/TransactionHistory";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-10 p-8">
        
        {/* Header Section */}
        <section className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Decentralized Liquidity & Vault Protocol
          </h1>
          <p className="text-lg text-gray-600">
            Trustless, non-custodial asset management designed for secure smart-contract execution and real-time liquidity management.
          </p>
        </section>

        {/* Balances Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <VaultBalance />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <UserBalance />
          </div>
        </section>

        {/* Actions Section (Deposit & Withdraw) */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <Deposit />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <Withdraw />
          </div>
        </section>

        {/* Transaction History Section */}
        <section>
          <TransactionHistory />
        </section>
        
      </main>
    </div>
  );
}
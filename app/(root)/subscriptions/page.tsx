import React from 'react'
import type { Metadata } from "next";
import { PricingTable } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Subscriptions · Bookworm",
  description: "Choose the plan that fits your reading. Upgrade for more books, longer conversations, and more voice sessions.",
};

// Appearance is driven by the design-system tokens defined in globals.css (@theme / :root),
// so colours adapt automatically to light and dark mode instead of being hard-coded.
const pricingTableAppearance = {
  variables: {
    colorPrimary: 'var(--primary)',
    colorBackground: 'var(--card)',
    colorText: 'var(--foreground)',
    colorTextSecondary: 'var(--muted-foreground)',
    colorInputBackground: 'var(--card)',
    colorInputText: 'var(--foreground)',
    colorNeutral: 'var(--foreground)',
    colorDanger: 'var(--destructive)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-sans)',
  },
}

function Page() {
  return (
    <main className="container mx-auto flex flex-col">
      <div className="mt-26 grid gap-10 pb-20">
        <section className="flex flex-col gap-5 text-center items-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-[-0.02em]">
            Choose your plan
          </h1>
          <p className="text-md text-muted-foreground font-serif max-w-2xl">
            Upgrade for more books, longer conversations, and more monthly voice sessions.
            Cancel or change your plan any time.
          </p>
        </section>

        <div className="pricing-table-wrapper">
          <PricingTable appearance={pricingTableAppearance} />
        </div>
      </div>
    </main>
  )
}

export default Page

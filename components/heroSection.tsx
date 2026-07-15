import React from 'react'
import Link from 'next/link'
import { BookOpen, Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="mt-20 mb-20">
      <div className="bg-secondary rounded-3xl p-8 md:p-12 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-amber-900/10 shadow-sm">
        
        {/* Left Side */}
        <div className="flex-1 space-y-2">
          <h1 className="font-serif font-bold text-6xl text-secondary-foreground leading-tight">
            Your Library
          </h1>
          <p className="text-md text-secondary-foreground max-w-md font-serif mb-6">
            Organize your collection, explore new worlds, and keep track of your reading journey all in one place.
          </p>
          <Button
            asChild
            className="rounded-lg font-serif font-semibold h-auto w-auto text-md px-6 py-4 bg-amber-900 hover:bg-amber-950 shadow-md"
          >
            <Link href="/books/new" className="inline-flex items-center gap-2">
              <Plus size={20} />
              <span>Add New Book</span>
            </Link>
          </Button>
        </div>

        {/* Centre Side - Illustration */}
        <div className="lg:flex md:hidden sm:flex flex-1 justify-center items-center">
          <div className="relative">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and a globe"
              width={400}
              height={400}
              loading="eager"
            />
          </div>
        </div>

        {/* Right Side - Steps Card */}
        <div className="w-64">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-amber-900/5">
            <ul className="space-y-4">
              {[
                "Upload your PDF",
                "Wait for AI analysis",
                "Start chatting"
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-secondary-foreground flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-md text-secondary-foreground font-serif">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection

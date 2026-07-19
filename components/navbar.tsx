'use client'

import React from 'react'
import Link from "next/link"
import {BookOpen} from "lucide-react"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils";
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
  { label: "Pricing", href: "/subscriptions" },
]

const navItemsSignedOut = [
  { label: "Pricing", href: "/subscriptions" },
  { label: "Sign In", href: "/sign-in" },
]

const Navbar = () => {
  const pathName = usePathname()
  const { user } = useUser()

  return (
    // <header className="container mx-auto">
    <header className="fixed w-full z-0 bg-background">
      <div className="container mx-auto">
        <div className="py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex gap-0.5 items-center">
            <BookOpen width={34} height={32} className="pt-1" />
            <span className="font-serif font-bold text-2xl align-[20px]">Bookworm</span>
          </Link>

          {/* navbar items */}
          <nav className="flex gap-x-7 items-center overflow-x-auto">
            {user && navItems.map(({ label, href }) => {
              const isActive = pathName === href || (href !== '/' && pathName.startsWith(href))
              return (
                <Link
                  href={href}
                  key={label}
                  className={cn(
                    'text-md font-medium',
                    isActive ?
                      'text-amber-900 border-b-2 border-amber-900 pb-0.5' :
                      'text-black hover:opacity-70'
                  )}
                >
                  {label}
                </Link>
              )
            })}
            <div className="flex gap-7 items-center">
              <Show when="signed-out">
                <Link href="/subscriptions" key="pricing" className={cn(
                  'text-md font-medium',
                  pathName === '/subscriptions' || pathName.startsWith('subscriptions') ?
                    'text-amber-900 border-b-2 border-amber-900 pb-0.5' :
                    'text-black hover:opacity-70'
                )}
                >
                  Pricing
                </Link>
                <div className="text-md font-medium text-black hover:opacity-70">
                  <SignInButton />
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
export default Navbar



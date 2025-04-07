"use client"
import Link from "next/link";
import { useUser } from "@/lib/useUser";
import { UserDropDown } from "../userDropDown";
import AuthModal from "../authmodel";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
const menuItems = [
  {
    name: "Home",
    href: "/",
  },

];

export function Header() {
  const { user } = useUser()
  const [isAuthOpen, setAuthOpen] = useState(false)
  return (
    <div className="relative w-full bg-white dark:bg-black">
      <div className="mx-auto flex max-w-7xl gap-y-5 sm:gap-0 items-center justify-between flex-row px-4 pr-7 py-2 ">
        <div className="inline-flex items-center space-x-2">
          <Link href={"/"}>
            <span className="font-bold text-black dark:text-white text-3xl">{"{ JSON }"} </span>
          </Link>
        </div>
     

        <div className="flex justify-between gap-9 flex-row item-center">
          <ul className="  inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="inline-flex transition-all  text-black dark:text-white items-center border-b-2 border-white dark:border-black dark:hover:border-white hover:border-black font-semibold  hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          {
            user ?
              <UserDropDown />
              :
              <>

                <button
                  onClick={() => setAuthOpen(true)}
                >
                  <FaRegUser size={22} className="text-black" />
                </button>
              </>
          }
          <AuthModal
            open={isAuthOpen}
            onClose={(open) => setAuthOpen(open)}
          />
        </div>
      </div>
    </div>
  );
}
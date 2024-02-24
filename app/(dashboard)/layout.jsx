"use client";

import { useAuth } from "@/firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "./loading";
import Header from "@/components/Header";

export default function Layout({ children }) {

  const pathname = usePathname();
  const User = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header/>
      <div className="flex flex-1 pt-20 pb-16">
        {
          User ? children : <Loading/>
        }
        </div>
      <div className="fixed bottom-0 flex justify-evenly w-full h-16 bg-white text-gray-400 text-2xl rounded-t-xl shadow-2xl">
        <div
          className={`flex flex-col w-1/3 justify-center items-center ${
            pathname === "/home" && "text-primary"
          }`}
        >
          <Link href={"/home"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`icon icon-tabler icon-tabler-home `}
              width={30}
              height={30}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
          </Link>
          <span className="text-xs select-none">Home</span>
        </div>
        <div
          className={`flex flex-col w-1/3 justify-center items-center ${
            pathname === "/history" && "text-primary"
          }`}
        >
          <Link href={"/history"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`icon icon-tabler icon-tabler-history`}
              width={30}
              height={30}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 8l0 4l2 2" />
              <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
          </Link>
          <span className="text-xs select-none">History</span>
        </div>
        <div
          className={`flex flex-col w-1/3 justify-center items-center ${
            pathname === "/profile" && "text-primary"
          }`}
        >
          <Link href={"/profile"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`icon icon-tabler icon-tabler-user-circle `}
              width={30}
              height={30}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
            </svg>
          </Link>
          <span className="text-xs select-none">Profile</span>
        </div>
      </div>
    </div>
  );
}

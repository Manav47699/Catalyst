"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import CatalystLogo from "@/public/Catalyst.jpg";

export default function Page() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-emerald-900 to-emerald-950">
      <nav className="border-b border-emerald-500/50 px-8 py-5 flex items-center justify-between backdrop-blur-sm bg-emerald-900/80 sticky top-0 z-10">
        <div
          className="text-4xl bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent font-bold tracking-wide"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Catalyst
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push("/login")}
            className="px-7 py-3 text-emerald-100 font-medium hover:text-white hover:bg-emerald-700/50 rounded-lg transition-all duration-200"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push("/signup")}
            className="px-7 py-3 bg-white text-emerald-900 font-medium rounded-lg hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-300/20 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </nav>
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-16">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
            Catalyst
          </h1>
          <p className="text-4xl text-emerald-100 mb-8 font-light tracking-tight">Get your startup off the ground</p>
          <p className="text-emerald-200 leading-relaxed max-w-lg text-xl">
            Connect with consumers and investors in one place and expand the horizons of your startup by creating new
            connections.
          </p>
          <p className="text-emerald-200 leading-relaxed max-w-lg text-xl mt-3">
            We will help you grow your startup to new heights.
          </p>
          <button 
            onClick={() => router.push("/signup")}
            className="mt-8 px-10 py-4 bg-gradient-to-r from-emerald-400 to-teal-300 text-white font-semibold rounded-xl hover:from-emerald-300 hover:to-teal-200 hover:shadow-xl hover:shadow-emerald-400/50 transition-all duration-300 w-fit text-lg"
          >
            Sign Up For Catalyst
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900/90 to-emerald-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 p-8 bg-emerald-800/30 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-400/30 border border-emerald-500/40">
            <Image src={CatalystLogo} alt="Catalyst Logo" width={320} height={320} />
          </div>
        </div>
      </div>
    </div>
  );
}
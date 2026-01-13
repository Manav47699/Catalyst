"use client";

import { useRef } from "react";

export default function ChatVideoPage() {
  const videoRef = useRef(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Video Container */}
        <div className="backdrop-blur-xl bg-emerald-800/30 rounded-3xl border border-emerald-500/40 shadow-2xl shadow-emerald-900/50 p-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent mb-6">
            Video Chat
          </h1>
          
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/50 bg-black">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls
              controlsList="nodownload"
            >
              <source src="/chat_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Fullscreen Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleFullscreen}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 text-white font-semibold rounded-xl hover:from-emerald-300 hover:to-teal-200 hover:shadow-xl hover:shadow-emerald-400/50 transition-all duration-300 flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
                />
              </svg>
              Enter Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mentorName = searchParams.get("doctor_name") || "your mentor";

  const goBack = () => {
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="backdrop-blur-xl bg-emerald-800/30 rounded-3xl border border-emerald-500/40 shadow-2xl shadow-emerald-900/50 p-12">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-300 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-400/40">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-2xl text-emerald-100 text-center mb-8 font-light">
            Thank you for booking your appointment
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-300 mx-auto mb-8 rounded-full"></div>

          {/* Details */}
          <div className="bg-emerald-900/40 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 mb-8">
            <p className="text-emerald-200 text-lg leading-relaxed text-center">
              Your mentor has received an email notification about your booking request. 
              They will review your information and reach out to you shortly to confirm the appointment details.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={goBack}
            className="w-full px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-300 text-white font-semibold text-lg rounded-xl hover:from-emerald-300 hover:to-teal-200 hover:shadow-xl hover:shadow-emerald-400/50 transition-all duration-300"
          >
            Return to Feed
          </button>

          {/* Additional Info */}
          <p className="text-emerald-300/60 text-sm text-center mt-6">
            You will receive a confirmation email shortly
          </p>
        </div>
      </div>
    </div>
  );
}
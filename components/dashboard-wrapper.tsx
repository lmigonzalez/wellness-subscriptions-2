"use client";

import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard />
    </Suspense>
  );
}

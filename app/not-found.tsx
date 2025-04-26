"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="max-w-xl mx-auto">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">404 - Page Not Found</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="p-22">
          <p className="text-lg mb-6 text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 text-black rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

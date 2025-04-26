"use client";

import Image from "next/image";
import cardData from "@/data/cards.json";
import { useRouter } from "next/navigation";

export default function Policies() {
  const router = useRouter();

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 py-6">
      {cardData.map((card) => (
        <div key={card.id} className="shadow-lg overflow-hidden flex flex-col">
          <div className="window">
            <div className="title-bar">
              <div className="title-bar-text"></div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Restore"></button>
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="window-body">
              <div>
                <Image
                  src={card.image}
                  alt={card.title}
                  width={600}
                  height={300}
                  className="rounded-md w-full h-48 object-cover border"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl text-black font-bold mb-1">
                    {card.title}
                  </h2>
                  <p className="text-sm text-black mb-1">{card.subtitle}</p>
                  <p className="text-black mb-3">{card.description}</p>
                </div>

                <button
                  onClick={() => router.push(card.buttonLink)}
                  className="mt-auto inline-block cursor-pointer text-black"
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

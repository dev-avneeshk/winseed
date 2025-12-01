"use client";

import React from "react";
import {
  Carousel,
  Card,
  type AppleCard,
} from "@/components/ui/apple-cards-carousel";

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => (
        <div
          key={`dummy-content-${index}`}
          className="mb-4 rounded-3xl bg-[#F5F5F7] p-8 dark:bg-neutral-800 md:p-14"
        >
          <p className="mx-auto max-w-3xl font-sans text-base text-neutral-600 dark:text-neutral-400 md:text-2xl">
            <span className="font-bold text-neutral-700 dark:text-neutral-200">
              The first rule of Apple club is that you boast about Apple club.
            </span>{" "}
            Keep a journal, quickly jot down a grocery list, and take amazing
            class notes. Want to convert those notes to text? No problem.
            Langotiya jeetu ka mara hua yaar is ready to capture every thought.
          </p>
          <img
            src="https://assets.aceternity.com/macbook.png"
            alt="Macbook mockup from Aceternity UI"
            height={500}
            width={500}
            className="mx-auto h-full w-full object-contain md:h-1/2 md:w-1/2"
            loading="lazy"
          />
        </div>
      ))}
    </>
  );
};

const newsCards: AppleCard[] = [
  {
    category: "India Market",
    title: "New Zealand Seed Company Winning Over India Market",
    src: "https://www.winseed.co.nz/wp-content/uploads/2025/10/Winseed-Hero-Image-2-1024x724.jpg",
    content: <DummyContent />,
  },
  {
    category: "Global Presence",
    title: "Strengthening Global Presence: Winseed opens new HQ in India",
    src: "https://www.winseed.co.nz/wp-content/uploads/2025/07/News-Story-1-a-1024x683.jpg",
    content: <DummyContent />,
  },
  {
    category: "Leadership",
    title: "Winseed Appoints Dr. Vinod Yadav as CEO of Winseed India",
    src: "https://www.winseed.co.nz/wp-content/uploads/2025/07/News-Story-2-c-1024x768.jpg",
    content: <DummyContent />,
  },
  {
    category: "Beetroot Leadership",
    title: "Strategic Investment: Expanding Our Global Beetroot Leadership",
    src: "https://www.winseed.co.nz/wp-content/uploads/2025/07/News-Story-3-b-819x1024.jpg",
    content: <DummyContent />,
  },
];

const data: AppleCard[] = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];

export default function AppleCardsCarouselDemo() {
  const cards = newsCards.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full py-20">
      <Carousel items={cards} />
    </div>
  );
}


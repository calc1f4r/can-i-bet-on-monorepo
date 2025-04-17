"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaTelegramPlane } from "react-icons/fa";

const TELEGRAM_TWEET_ID = "9999999999999999999999999999999999";

interface TweetProps {
  id: string;
}

const Tweet: React.FC<TweetProps> = ({ id }) => {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  console.log(id);
  if (id === TELEGRAM_TWEET_ID) {
    return (
      <Link
        href={`https://t.me/HalluciBetrBot`}
        target="_blank"
        style={{
          backgroundColor: "#27aaec",
        }}
        className="w-full h-full flex items-center mt-4 justify-center rounded-xl p-4 text-base md:text-xl text-white"
      >
        <FaTelegramPlane className="mr-4" />
        Pool created privately in Telegram
      </Link>
    );
  }

  return (
    <div>
      <script async src="https://platform.twitter.com/widgets.js" />
      <blockquote
        className="twitter-tweet bg-black"
        data-dnt="true"
        data-theme="dark"
        data-cards="hidden"
        data-conversation="none"
      >
        <a href={`https://twitter.com/x/status/${id}`}></a>
      </blockquote>
    </div>
  );
};

export default Tweet;

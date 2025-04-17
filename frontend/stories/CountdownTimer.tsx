"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export interface CountdownTimerProps {
  betsCloseAt: number;
  className?: string;
  poolStatus?: "PENDING" | "GRADED";
  winningOption?: string;
  winningOptionIndex?: string;
  compact?: boolean;
}

export const CountdownTimer = ({
  betsCloseAt,
  className = "",
  poolStatus = "PENDING",
  winningOption = "",
  winningOptionIndex = "",
  compact = false,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [timeDigits, setTimeDigits] = useState<string[]>([]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = betsCloseAt - now;

      if (diff <= 0) {
        return "Betting closed";
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const updateTime = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      // Split the time string into individual characters, including colons
      if (newTimeLeft !== "Betting closed") {
        setTimeDigits(newTimeLeft.split(""));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [betsCloseAt]);

  // If the pool is graded, show the winning option
  if (poolStatus === "GRADED") {
    if (compact) {
      return (
        <div className={`flex items-center text-green-500 ${className}`}>
          <span className="text-sm font-medium">Bets closed</span>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center text-green-500 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center"
        >
          Bets closed
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-medium mt-2 text-center"
        >
          {winningOption} won
        </motion.div>
      </div>
    );
  }

  // If the pool is not pending OR there is no time left, show grading in progress
  if (poolStatus !== "PENDING" || timeLeft === "Betting closed") {
    if (compact) {
      return (
        <div className={`flex items-center text-amber-500 ${className}`}>
          <span className="text-sm font-medium">Bets closed</span>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center text-amber-500 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center"
        >
          Bets closed on{" "}
          {new Date(betsCloseAt * 1000).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-medium mt-2 text-center"
        >
          Grading in progress...
        </motion.div>
      </div>
    );
  }

  // Compact variant: just show the time with a clock icon
  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Clock className="h-3.5 w-3.5 text-amber-500" />
        <div className="text-sm font-medium flex">
          <AnimatePresence mode="popLayout">
            {timeDigits.map((digit, index) => (
              <motion.span
                key={`${index}-${digit}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className={digit === ":" ? "mx-0.5" : "tabular-nums"}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Default case: show countdown timer
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex flex-col items-center w-full">
        <p className="text-sm text-center">
          Bets close at{" "}
          {new Date(betsCloseAt * 1000).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
        <div className="text-4xl font-bold flex justify-center">
          <AnimatePresence mode="popLayout">
            {timeDigits.map((digit, index) => (
              <motion.span
                key={`${index}-${digit}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
                className={digit === ":" ? "mx-1" : "tabular-nums"}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

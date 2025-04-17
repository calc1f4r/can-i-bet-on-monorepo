import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./ui/button";

interface FollowXButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  username: string;
  className?: string;
  children?: React.ReactNode;
}

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7852 9.88256L8.80452 4H4L10.0384 12.8955L4 20H5.38119L10.5707 13.7878L14.7263 20H19.5308L13.3171 10.7749H13.3174ZM11.1645 12.9738L10.4474 11.9348L5.97631 5.27954H8.0598L11.6252 10.5789L12.3423 11.6179L17.0641 18.6758H14.9806L11.1645 12.9741V12.9738Z" />
  </svg>
);

export const FollowXButton = React.forwardRef<
  HTMLButtonElement,
  FollowXButtonProps
>(({ username, className, children, ...props }, ref) => {
  const handleClick = () => {
    window.open(`https://x.com/${username}`, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const buttonText = children || `Follow @${username}`;

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(className)}
      aria-label={`Follow ${username} on X (Twitter)`}
      tabIndex={0}
      role="link"
      {...props}
    >
      <XIcon />
      <span>{buttonText}</span>
    </Button>
  );
});

FollowXButton.displayName = "FollowXButton";

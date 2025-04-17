import Jazzicon from "react-jazzicon";

interface CreatorInfoProps {
  creatorId: string;
  creatorName: string;
  className?: string;
}

export const CreatorInfo = ({
  creatorId,
  creatorName,
  className = "",
}: CreatorInfoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-5 w-5 flex-shrink-0">
        <Jazzicon diameter={20} seed={parseInt(creatorId || "0")} />
      </div>
      <span className="text-sm font-medium text-muted-foreground truncate">
        {creatorName}
      </span>
    </div>
  );
};

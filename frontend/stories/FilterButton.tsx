/*
Buttons that appear as filters on the pools/ listing page ("Politics", "Sports", "Entertainment", etc.)
*/
import { FC } from "react";

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const FilterButton: FC<FilterButtonProps> = ({
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium
        transition-colors duration-200
        ${
          isActive
            ? "bg-primary text-black"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {label}
    </button>
  );
};

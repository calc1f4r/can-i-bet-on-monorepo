"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { FaRegHeart } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { MdOutlineModeComment, MdStackedLineChart } from "react-icons/md";
import { usdcAmountToDollarsNumber } from "@/lib/utils";

interface IconsWithNumbersProps {
  icon: IconType;
  number: number;
  abbreviateNumbers?: boolean;
  prefix?: string;
  suffix?: string;
  size?: number;
  decimalPlaces?: number;
  minValForDecimals?: number;
  alwaysRoundUp?: boolean;
}

// Transforms a number into a string with the appropriate number of decimal places
// and abbreviates (7.5K, 1.2M, etc.) if specified
const formatNumber = (
  num: number,
  abbreviate: boolean,
  decimalPlaces: number,
  minValForDecimals: number, // If the number is greater than or equal to this, show decimals (used to only show decimals when abbreviation kicks in)
  alwaysRoundUp = false // If true, always round up to the nearest decimal place, so 7001 becomes 7.1k, etc
): string => {
  const shouldShowDecimals = num >= minValForDecimals;
  const effectiveDecimalPlaces = shouldShowDecimals ? decimalPlaces : 0;

  if (alwaysRoundUp && abbreviate && shouldShowDecimals) {
    // Round up to nearest decimal place
    const factor = Math.pow(10, effectiveDecimalPlaces);
    num = Math.ceil(num * factor) / factor;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    notation: abbreviate ? "compact" : "standard",
    maximumFractionDigits: effectiveDecimalPlaces,
    minimumFractionDigits: effectiveDecimalPlaces,
  });

  return formatter.format(num);
};

const AnimatedNumber = ({
  value,
  formatFn,
}: {
  value: number;
  formatFn: (n: number) => string;
}) => {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => formatFn(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.2,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
};

const IconsWithNumbers = ({
  icon: Icon,
  number,
  abbreviateNumbers = true,
  prefix = "",
  suffix = "",
  size = 20,
  decimalPlaces = 0,
  minValForDecimals = 1000,
  alwaysRoundUp = false,
}: IconsWithNumbersProps) => {
  const formatNumberWithConfig = (num: number) =>
    formatNumber(
      num,
      abbreviateNumbers,
      decimalPlaces,
      minValForDecimals,
      alwaysRoundUp
    );

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon size={size} className="flex-shrink-0" />
      <span className="text-sm">
        {prefix}
        <AnimatedNumber value={number} formatFn={formatNumberWithConfig} />
        {suffix}
      </span>
    </div>
  );
};

// Convenience presets

export const VolumeWithIcon = ({ number }: { number: number }) => (
  <IconsWithNumbers
    icon={MdStackedLineChart}
    number={usdcAmountToDollarsNumber(number)}
    prefix="$" //TODO i18n code smell
    suffix=" vol."
    decimalPlaces={0}
    minValForDecimals={1000}
    abbreviateNumbers={true}
  />
);

export const LikesWithIcon = ({ number }: { number: number }) => (
  <IconsWithNumbers
    icon={FaRegHeart}
    number={number}
    decimalPlaces={1}
    minValForDecimals={1000}
    abbreviateNumbers={true}
    alwaysRoundUp={true}
  />
);

export const RetweetsWithIcon = ({ number }: { number: number }) => (
  <IconsWithNumbers
    icon={FaRepeat}
    number={number}
    decimalPlaces={1}
    minValForDecimals={1000}
    abbreviateNumbers={true}
    alwaysRoundUp={true}
  />
);

export const CommentsWithIcon = ({ number }: { number: number }) => (
  <IconsWithNumbers
    icon={MdOutlineModeComment}
    number={number}
    decimalPlaces={1}
    minValForDecimals={1000}
    abbreviateNumbers={true}
    alwaysRoundUp={true}
  />
);

export default IconsWithNumbers;

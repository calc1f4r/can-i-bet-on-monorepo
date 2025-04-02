import { TokenType } from "@/lib/__generated__/graphql";
import Image from "next/image";
import { ReactNode } from "react";

/**
 * Renders the USDC prefix based on the chain configuration
 * @param chainConfig The chain configuration object
 * @param showPlus Whether to show a '+' sign before the currency symbol (useful for potential earnings)
 * @returns A string or React component representing the USDC prefix
 */
// export const renderUsdcPrefix = (
//   tokenType?: TokenType | null,
//   showPlus: boolean = false
// ): ReactNode => {
//   const prefix = tokenType === TokenType.Usdc ? "$" : "BET";
//   const plusSign = showPlus ? "+" : "";

//   if (!prefix) return `${plusSign}$`;

//   if (typeof prefix === "string") {
//     return `${plusSign}${prefix}`;
//   } else {
//     return (
//       <>
//         {plusSign}
//         <Image
//           src={prefix.src}
//           width={prefix.width || 16}
//           height={prefix.height || 16}
//           alt="USDC"
//           className="inline-block mr-0.5"
//         />
//       </>
//     );
//   }
// };

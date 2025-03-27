"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  value: string;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CopyButton({
  value,
  className,
  variant = "outline",
  size = "icon",
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/api/netlify-webhook/${value}`
      );
      setHasCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={copyToClipboard}
            className={className}
          >
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">
              {hasCopied ? "Copied" : "Copy API to clipboard"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {hasCopied ? "Copied!" : "Copy API to clipboard"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { type FC, type ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils.ts";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  rounded?: boolean;
  bordered?: boolean;
  ariaHidden?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export const Image: FC<ImageProps> = ({
  className,
  fallbackSrc = "/fallback-image.png",
  rounded,
  bordered,
  src,
  alt,
  ariaHidden,
  ariaLabel,
  ariaLabelledBy,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {loading && !error && (
        <Skeleton className="absolute inset-0 w-full h-full animate-pulse bg-gray-200" />
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt || ""}
        className={cn(
          "object-cover transition-opacity duration-300",
          rounded && "rounded-lg",
          bordered && "border border-gray-200",
          loading ? "opacity-0" : "opacity-100",
        )}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      />
    </div>
  );
};

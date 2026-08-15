"use client";

import { useCallback, useState } from "react";

type SmartImageProps = {
  src?: string | null;
  alt?: string;
  /** Classes for the <img> itself. */
  className?: string;
  /** Classes for the wrapper that holds the shimmer placeholder. */
  wrapperClassName?: string;
  /** Rendered instead of the image when there is no src, or it fails to load. */
  fallback?: React.ReactNode;
  /**
   * Extra wrapper classes applied only while loading. Use it to reserve height
   * for images whose box isn't sized by the parent (e.g. in-article images),
   * so the shimmer has something to fill.
   */
  placeholderClassName?: string;
  loading?: "lazy" | "eager";
};

/**
 * <img> that shimmers until the bitmap is actually decoded, then cross-fades in.
 * Prevents the empty-box flash that plain <img> shows on slow connections.
 */
export default function SmartImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "w-full h-full",
  fallback = null,
  placeholderClassName = "",
  loading = "lazy",
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Images served from cache can finish before React attaches onLoad.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  if (!src || failed) return <>{fallback}</>;

  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName} ${
        loaded ? "" : placeholderClassName
      }`}
    >
      {!loaded && <span aria-hidden className="shimmer absolute inset-0 z-10" />}
      {/* The fade lives on this span so callers keep full control of the
          <img> classes (object-fit, group-hover transforms, …). */}
      <span
        className={`block w-full h-full transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={className}
        />
      </span>
    </span>
  );
}

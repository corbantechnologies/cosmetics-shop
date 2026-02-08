import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
  showHomeLink?: boolean;
}

export default function ErrorState({
  message = "Something went wrong",
  retry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-6">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif font-semibold text-foreground">
          Oops! Something went wrong
        </h3>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {showHomeLink && (
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground rounded-sm font-medium hover:bg-secondary transition-colors"
          >
            Go Home
          </a>
        )}
      </div>
    </div>
  );
}

// Compact Error State (for smaller components)
export function CompactErrorState({
  message = "Failed to load",
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <AlertCircle className="w-8 h-8 text-error" />
      <p className="text-sm text-muted-foreground text-center">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  );
}

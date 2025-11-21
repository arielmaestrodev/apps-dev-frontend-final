"use client";

import Image from "next/image";
import { Github, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateOAuth } from "@/services/auth";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type OAuthProvider = "google" | "github";

interface OAuthButtonsProps {
  isLoading?: boolean;
  onProviderClick?: (provider: OAuthProvider) => void;
}

export function OAuthButtons({ isLoading: externalLoading, onProviderClick }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthClick = (provider: OAuthProvider) => {
    if (externalLoading || loadingProvider) return;
    
    try {
      setLoadingProvider(provider);
      setError(null);
      onProviderClick?.(provider);
      initiateOAuth(provider);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initiate OAuth";
      setError(errorMessage);
      setLoadingProvider(null);
      toast.error(errorMessage);
    }
  };

  const isLoading = externalLoading || loadingProvider !== null;

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      <Button
        type="button"
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => handleOAuthClick("google")}
        disabled={isLoading}
      >
        {loadingProvider === "google" ? (
          <>
            <Spinner />
            Connecting...
          </>
        ) : (
          <>
            <Image src="/google.webp" alt="Google" width={18} height={18} />
            Continue with Google
          </>
        )}
      </Button>
      <Button
        type="button"
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => handleOAuthClick("github")}
        disabled={isLoading}
      >
        {loadingProvider === "github" ? (
          <>
            <Spinner />
            Connecting...
          </>
        ) : (
          <>
            <Github className="w-4 h-4" />
            Continue with GitHub
          </>
        )}
      </Button>
    </>
  );
}


import { useState, useEffect } from "react";

export function useProviderProfile(providerId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/provider/${providerId}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch provider profile", error);
      } finally {
        setLoading(false);
      }
    }

    if (providerId) {
      fetchProfile();
    }
  }, [providerId]);

  return { profile, loading };
}

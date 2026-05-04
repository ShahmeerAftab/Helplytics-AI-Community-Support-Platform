"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearAuthData } from "@/lib/api";

/**
 * useAuth — Auth Guard Hook
 *
 * What it does:
 *   1. Checks if a JWT token exists in localStorage
 *   2. If NO token → immediately redirects to /auth
 *   3. If token EXISTS → calls GET /api/auth/me to validate it
 *      - If /me succeeds → user is authenticated, sets user state
 *      - If /me fails (401) → token is invalid/expired, clears storage, redirects to /auth
 *   4. Returns { user, loading, logout } to the component
 *
 * Usage (in any protected page):
 *   const { user, loading, logout } = useAuth();
 *
 *   if (loading) return <LoadingSpinner />;
 *   // At this point, user is guaranteed to be authenticated
 *   return <Dashboard user={user} onLogout={logout} />;
 *
 * Why call /me instead of just checking if token exists?
 *   A token can exist in localStorage but be expired or invalid.
 *   Calling /me validates the token with the server, giving us:
 *     a) Confirmation the user is still authenticated
 *     b) Fresh user data (username, email, etc.)
 */
export function useAuth() {
  const router = useRouter();

  /* user state — null until authentication is confirmed */
  const [user, setUser] = useState(null);

  /* loading state — true while we're checking auth */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      /* Step 1 — Quick localStorage check */
      const token = localStorage.getItem("token");

      if (!token) {
        /* No token at all — redirect immediately without hitting the API */
        router.replace("/auth");
        return;
      }

      /* Step 2 — Validate the token by calling /me */
      try {
        const data = await apiFetch("/api/auth/me");
        /* Token is valid — store the user */
        setUser(data.user);
      } catch {
        /* /me failed — token is bad or server unreachable. Clear storage and redirect. */
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/auth");
        return;
      } finally {
        /* Always stop the loading spinner, whether success or failure */
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  /**
   * logout — clears all auth data and redirects to /auth
   * Call this when the user clicks "Sign Out"
   */
  function logout() {
    clearAuthData();
    router.push("/auth");
  }

  return { user, loading, logout };
}

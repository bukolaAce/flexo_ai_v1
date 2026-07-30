"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrainingPlan, UserProfile } from "@/types";
import { authClient } from "@/lib/auth/client";
import { api } from "@/lib/api";

interface AuthContextType {
  user: any;
  plan: TrainingPlan | null;
  isLoading: boolean;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: (userId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  // Reactive session — updates automatically on sign-in/sign-out,
  // unlike a one-shot getSession() call in a mount-only effect.
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const isRefreshingRef = useRef(false);

  const refreshData = useCallback(
    async (userId?: string) => {
      const id = userId ?? user?.id;
      if (!id || isRefreshingRef.current) return;

      isRefreshingRef.current = true;

      try {
        const planData = await api.getCurrentPlan(id).catch(() => null);
        if (planData) {
          setPlan({
            id: planData.id,
            userId: planData.userId,
            overview: planData.planJson.overview,
            weeklySchedule: planData.planJson.weeklySchedule,
            progression: planData.planJson.progression,
            version: planData.version,
            createdAt: planData.createdAt,
          });
        } else {
          setPlan(null);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [user?.id],
  );

  // Runs whenever the session actually changes — sign-in, sign-out,
  // or the initial load resolving — since `user?.id` now comes from
  // the reactive hook above instead of a stale one-time fetch.
  useEffect(() => {
    if (isPending) return;

    if (user?.id) {
      refreshData(user.id);
    } else {
      setPlan(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isPending]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    if (!user) {
      throw new Error("User must be authenticated to save profile");
    }

    await api.saveProfile(user.id, profileData);
    await refreshData(user.id);
  }

  async function generatePlan() {
    if (!user) {
      throw new Error("User must be authenticated to generate plan");
    }

    await api.generatePlan(user.id);
    await refreshData(user.id);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        plan,
        isLoading: isPending,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
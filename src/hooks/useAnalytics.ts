"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UserSession {
  id: string;
  user_id: string;
  subject: string;
  score: number;
  duration_mins: number;
  session_type: "quiz" | "practice" | "ai_tutor";
  topics: string[] | null;
  created_at: string;
}

export interface SubjectStat {
  subject: string;
  sessions: number;
  avgScore: number;
  totalMins: number;
  lastAttemptAt: string;
}

export interface AnalyticsData {
  sessions: UserSession[];
  avgAccuracy: number | null;
  totalStudyMins: number;
  sessionsByDay: Record<string, number>;
  subjectStats: SubjectStat[];
  recentSubjects: SubjectStat[];
  isLoading: boolean;
  isEmpty: boolean;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function useAnalytics(): AnalyticsData {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSessions() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (!cancelled) {
          setSessions([]);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error("[useAnalytics] Fetch failed:", error.message);
          setSessions([]);
        } else {
          setSessions((data ?? []) as UserSession[]);
        }
        setIsLoading(false);
      }
    }

    fetchSessions();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("user_sessions_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_sessions" },
        (payload) => {
          setSessions((prev) => [payload.new as UserSession, ...prev]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const avgAccuracy = useMemo(() => {
    if (sessions.length === 0) return null;
    const total = sessions.reduce((sum, s) => sum + (s.score ?? 0), 0);
    return Math.round(total / sessions.length);
  }, [sessions]);

  const totalStudyMins = useMemo(() => {
    return sessions.reduce((sum, s) => sum + (s.duration_mins ?? 0), 0);
  }, [sessions]);

  const sessionsByDay = useMemo(() => {
    const map: Record<string, number> = {
      MON: 0,
      TUE: 0,
      WED: 0,
      THU: 0,
      FRI: 0,
      SAT: 0,
      SUN: 0,
    };

    for (const s of sessions) {
      const day = DAYS[new Date(s.created_at).getDay()];
      map[day] = (map[day] ?? 0) + 1;
    }
    return map;
  }, [sessions]);

  const subjectStats = useMemo(() => {
    const bySubject: Record<string, { scores: number[]; totalMins: number; lastAttemptAt: string }> = {};

    for (const s of sessions) {
      const existing = bySubject[s.subject] ?? { scores: [], totalMins: 0, lastAttemptAt: s.created_at };
      existing.scores.push(s.score ?? 0);
      existing.totalMins += s.duration_mins ?? 0;
      if (s.created_at > existing.lastAttemptAt) {
        existing.lastAttemptAt = s.created_at;
      }
      bySubject[s.subject] = existing;
    }

    return Object.entries(bySubject)
      .map(([subject, data]) => ({
        subject,
        sessions: data.scores.length,
        avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        totalMins: data.totalMins,
        lastAttemptAt: data.lastAttemptAt,
      }))
      .sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime());
  }, [sessions]);

  const recentSubjects = useMemo(() => {
    return subjectStats.slice(0, 3);
  }, [subjectStats]);

  return {
    sessions,
    avgAccuracy,
    totalStudyMins,
    sessionsByDay,
    subjectStats,
    recentSubjects,
    isLoading,
    isEmpty: sessions.length === 0,
  };
}

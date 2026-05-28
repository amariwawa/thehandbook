"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SessionPayload {
  subject: string;
  score: number;
  duration_mins: number;
  session_type: "quiz" | "practice" | "ai_tutor";
  topics?: string[];
}

export function useRecordSession() {
  const recordSession = useCallback(
    async (payload: SessionPayload) => {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("[useRecordSession] No authenticated user, skipping.", userError);
        return;
      }

      const row = {
        user_id: user.id,
        subject: payload.subject,
        score: payload.score,
        duration_mins: payload.duration_mins,
        session_type: payload.session_type,
        topics: payload.topics ?? null,
      };

      console.log("[useRecordSession] Inserting:", row);

      const { error } = await supabase.from("user_sessions").insert(row);

      if (error) {
        console.error("[useRecordSession] Insert failed:", error.message);
      } else {
        console.log("[useRecordSession] Insert succeeded.");
      }
    },
    []
  );

  return { recordSession };
}

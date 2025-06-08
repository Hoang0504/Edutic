"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

function TestPage() {
  useEffect(() => {
    const channel = supabase
      .channel("public:realtime_notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "realtime_notifications",
          filter: "user_id=d0f6b9b8-12c7-4b15-9c31-b6f90c6e2950",
        },
        (payload) => {
          console.log("New notification:", payload.new);
        }
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.warn("Subscription issue:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <h1>Realtime Test Page</h1>;
}

export default TestPage;

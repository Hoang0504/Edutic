import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { error } = await supabase.from("realtime_notifications").insert({
    user_id,
    title: "Time to review!",
    content: "Your flashcards are waiting 🧠",
    notification_type: "reminder",
    is_read: false,
  });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: "Notification inserted" });
}

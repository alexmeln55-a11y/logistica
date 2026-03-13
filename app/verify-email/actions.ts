"use server";

import { verifyEmailToken } from "@/lib/auth/email-verification";

export async function verifyEmailAction(token: string) {
  if (!token) {
    return { success: false as const, error: "not_found" as const };
  }
  return verifyEmailToken(token);
}

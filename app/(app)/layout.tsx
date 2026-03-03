import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return <AppShell role={profile.role}>{children}</AppShell>;
}

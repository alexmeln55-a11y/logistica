import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AppShell } from "@/components/app-shell";
import type { CurrentUser } from "@/lib/auth/types";

const DEV_USER: CurrentUser = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@local",
  full_name: "Dev Mode",
  role: "owner",
  position: null,
  access_level: "full_access",
  can_view_users: true,
  can_manage_users: true,
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBypass = process.env.DEV_BYPASS_AUTH === "true";
  const user = isBypass ? DEV_USER : await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell role={user.role} fullName={user.full_name} email={user.email}>
      {children}
    </AppShell>
  );
}

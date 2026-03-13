import { pool } from "@/lib/db/postgres";
import { requireAdminAccess } from "@/lib/auth/current-user";
import { canManageUsers } from "@/lib/permissions";
import { UsersTable } from "./users-table";
import { InviteModal } from "./invite-modal";
import type { UserListRow } from "@/lib/auth/types";

export default async function UsersPage() {
  const current = await requireAdminAccess();

  const { rows } = await pool.query<UserListRow>(
    `SELECT id, email, full_name, role, position, access_level,
            is_active, email_verified, can_view_users, can_manage_users, created_at
     FROM   users
     ORDER  BY created_at ASC`
  );

  const canInvite = canManageUsers(current);

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">Пользователи</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">{rows.length} учётных записей</p>
        </div>
        {canInvite && <InviteModal currentRole={current.role} />}
      </div>

      <UsersTable
        users={rows}
        currentUserId={current.id}
        currentRole={current.role}
      />
    </div>
  );
}

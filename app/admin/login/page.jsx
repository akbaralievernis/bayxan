"use client";

import PinLogin from "@/components/auth/PinLogin";

export default function AdminLoginPage() {
  return (
    <PinLogin
      portal="admin"
      allowedRoles={["admin", "manager"]}
      subtitle="· Вход для администратора ·"
      hint="Stub-режим: 0000 (Владелец) · 9012 (Менеджер)"
    />
  );
}

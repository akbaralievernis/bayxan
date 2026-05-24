"use client";

import Login from "@/components/auth/Login";

export default function AdminLoginPage() {
  return (
    <Login
      portal="admin"
      allowedRoles={["admin", "manager"]}
      subtitle="· Вход для администратора ·"
      hint="Логин / пароль: asanov / 0000 (Владелец) · bekbaev / 9012 (Менеджер)"
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import Login from "@/components/auth/Login";
import { setPosSession } from "@/lib/waiterSession";

export default function WaiterLoginPage() {
  const router = useRouter();
  return (
    <Login
      portal="waiter"
      allowedRoles={["waiter", "manager", "admin"]}
      subtitle="· Вход для официанта ·"
      hint="Логин / пароль: zhunusheva / 2222 (Алия) · abdyldaev / 3333 (Тимур)"
      onSuccess={(session) => {
        setPosSession(session);
        router.replace("/waiter");
      }}
    />
  );
}

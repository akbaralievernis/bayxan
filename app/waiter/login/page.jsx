"use client";

import { useRouter } from "next/navigation";
import PinLogin from "@/components/auth/PinLogin";
import { setPosSession } from "@/lib/waiterSession";

export default function WaiterLoginPage() {
  const router = useRouter();
  return (
    <PinLogin
      portal="waiter"
      allowedRoles={["waiter", "manager", "admin"]}
      subtitle="· Вход для официанта ·"
      hint="Stub: 2222 (Алия) · 3333 (Тимур)"
      onSuccess={(session) => {
        setPosSession(session);
        router.replace("/waiter");
      }}
    />
  );
}

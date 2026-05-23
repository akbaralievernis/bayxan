"use client";

import { useRouter } from "next/navigation";
import PinLogin from "@/components/auth/PinLogin";
import { setPosSession } from "@/lib/waiterSession";

export default function CashierLoginPage() {
  const router = useRouter();
  return (
    <PinLogin
      portal="cashier"
      allowedRoles={["cashier", "manager", "admin"]}
      subtitle="· Вход для кассира ·"
      hint="Stub: 4444 (Назгуль)"
      onSuccess={(session) => {
        setPosSession(session);
        router.replace("/cashier");
      }}
    />
  );
}

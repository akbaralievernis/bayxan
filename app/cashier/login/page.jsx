"use client";

import { useRouter } from "next/navigation";
import Login from "@/components/auth/Login";
import { setPosSession } from "@/lib/waiterSession";
import { setStaffSession } from "@/lib/staffSession";

export default function CashierLoginPage() {
  const router = useRouter();
  return (
    <Login
      portal="cashier"
      allowedRoles={["cashier", "manager", "admin"]}
      subtitle="· Вход для кассира ·"
      hint="Логин / пароль: orozova / 4444 (Кассир)"
      onSuccess={(session) => {
        setPosSession(session);
        setStaffSession(session);
        router.replace("/cashier");
      }}
    />
  );
}

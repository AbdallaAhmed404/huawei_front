import React from "react";
import LoginForm from "@/src/components/admin/login-form";



export default function LoginPage() {
  return (
    // استخدام min-h-screen لضمان التوسط التام في الشاشة مع خلفية سوداء صريحة
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <LoginForm />
    </div>
  );
}
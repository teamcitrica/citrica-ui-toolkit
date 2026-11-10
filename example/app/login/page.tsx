"use client";
import { useState } from "react";
import { Login, type LoginMode } from "citrica-ui-toolkit";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PANTALLAS: { mode: LoginMode; label: string }[] = [
  { mode: "login", label: "Login" },
  { mode: "forgot-password", label: "Olvidé mi contraseña" },
  { mode: "new-password", label: "Nueva contraseña" },
];

export default function LoginDemo() {
  const [mode, setMode] = useState<LoginMode>("login");

  return (
    <div className="flex flex-col items-start gap-4 p-4">
      {/* Para la prueba: ir directo a cada pantalla. En un proyecto real a
          "Nueva contraseña" se llega desde el enlace del correo. */}
      <div className="flex gap-2 text-sm">
        {PANTALLAS.map((p) => (
          <button
            key={p.mode}
            type="button"
            className={`rounded-full border px-3 py-1 ${mode === p.mode ? "border-[#265197] bg-[#265197] text-white" : "border-[#D5DDEB] text-[#265197]"}`}
            onClick={() => setMode(p.mode)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Login
        mode={mode}
        logo="/icon-svg/citrica-logo.svg"
        bgImage="/img-1.jpg"
        title="¡Bienvenido!"
        subtitle=""
        signupHref="/signup"
        // Login: "error@test.com" simula credenciales inválidas
        onLogin={async (email, password) => {
          console.log("login", { email, password });
          await wait(800);
          if (email === "error@test.com") {
            return { error: true, message: "Correo o contraseña incorrectos" };
          }
          alert(`Login OK: ${email}`);
          return {};
        }}
        // Olvidé mi contraseña: "falla@test.com" simula un error al enviar.
        // Si sale bien, el Login muestra la confirmación ("Revisa tu correo").
        onForgotPasswordClick={() => setMode("forgot-password")}
        onSendResetLink={async (email) => {
          console.log("reset link", email);
          await wait(800);
          if (email === "falla@test.com") {
            return { error: true, message: "No pudimos enviar el correo. Intenta de nuevo." };
          }
          return {};
        }}
        onBackToLogin={() => setMode("login")}
        // Nueva contraseña
        onSaveNewPassword={async (password) => {
          console.log("new password", password);
          await wait(800);
          setMode("login");
          return {};
        }}
        onCancel={() => setMode("login")}
      />
    </div>
  );
}

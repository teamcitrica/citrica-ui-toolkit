"use client";
import { Signup, Text } from "citrica-ui-toolkit";

export default function SignupDemo() {
  return (
    <Signup
      fullScreen
      image="/img-1.jpg"
      imageTitle={
        <>
          Tu acceso al curso{" "}
          <span className="italic text-[#c8f542]">Dumbbelldance</span> te
          espera.
        </>
      }
      imageDescription="Únete a miles de personas que están aprendiendo a transformar sus cuerpos a través del ritmo del baile y el poder de las mancuernas."
      title="Crear Cuenta"
      subtitle="Completa los datos para registrarte"
      termsHref="/terminos"
      submitButtonText="crear cuenta"
      submitFullWidth={false}
      submitHelperText="Serás redirigido a una página segura para completar tu pago."
      loginHref="/login"
      onSignup={async (values) => {
        console.log("signup", values);
        await new Promise((r) => setTimeout(r, 800));
        if (values.email === "taken@test.com") {
          return { error: true, message: "Ese correo ya está registrado" };
        }
      }}
    />
  );
}

'use client'
import { Button, Login } from "citrica-ui-toolkit";


export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Citrica UI Toolkit</h1>
      <p className="text-lg mb-8">This is an example of using the Citrica UI Toolkit in a Next.js application.</p>
      <div className="mb-4">
        <Button variant="primary" size="md">Primary Button</Button>
      </div>
      <Login />
    </div>
  );
}

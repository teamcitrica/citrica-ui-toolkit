'use client'
import { Button, Login } from 'citrica-ui-toolkit';


export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Citrica UI Toolkit</h1>
      <Button variant="primary" onPress={() => alert('Button Clicked!')}>
        Click Me
      </Button>


      <div className="mt-8">
        <Login
          onLogin={async (email: string, password: string) => {
            console.log('Login:', email, password);
            return {};
          }}
          onForgotPasswordClick={() => console.log('Forgot password')}
        />
      </div>
    </div>
  );
}

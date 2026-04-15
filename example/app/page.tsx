'use client'
import Button from '../shared/components/citrica-ui/molecules/button';
import LoginPage from '@/shared/components/citrica-ui/organism/login-container';


export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Citrica UI Toolkit</h1>
      <Button variant="primary" onClick={() => alert('Button Clicked!')}>
        Click Me
      </Button>


      <div className="mt-8 w-full max-w-md">
        <LoginPage />
      </div>
    </div>
  );
}

'use client'
import { Accordion, Button, Col, Container, Login, Text } from "citrica-ui-toolkit";

const faqs = [
  { id: 1, question: "¿Qué es Citrica?", answer: "Una librería de componentes React." },
  { id: 2, question: "¿Cómo se instala?", answer: "Con npm install citrica-ui-toolkit." },
  { id: 3, question: "¿Soporta admin theme?", answer: "Sí, con la prop isAdmin." },
];

export default function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Text variant="title" as="h1" className="mb-4">
          Welcome to Citrica UI Toolkit
        </Text>
        <Text variant="body" as="p" className="mb-8">
          This is an example of using the Citrica UI Toolkit in a Next.js application.
        </Text>
        <div className="mb-8">
          <Button variant="primary" size="md">Primary Button</Button>
        </div>
        <Login
          bgImageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop"
          bgImageAlt="Office workspace"
          onLogin={async (email: string, password: string) => {
            console.log('Login:', email, password);
            return {};
          }}
        />
      </div>

      <Container>
        <Col cols={{ lg: 8, md: 6, sm: 4 }} className="mx-auto py-20">
          <Accordion
            isAdmin
            defaultExpandedKeys={["1"]}
            selectionMode="single"
            variant="splitted"
            items={faqs.map((faq) => ({
              key: faq.id.toString(),
              title: faq.question,
              content: faq.answer,
              ariaLabel: faq.question,
            }))}
          />
        </Col>
      </Container>
    </>
  );
}

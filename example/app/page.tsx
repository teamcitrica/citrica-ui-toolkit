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

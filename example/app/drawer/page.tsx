'use client'
import { useState } from "react";
import { Button, Col, Container, Drawer, Text } from "citrica-ui-toolkit";

type OpenKey =
  | "basic"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "footer"
  | "customWidth"
  | "rightAdmin"
  | "rightNoAdmin"
  | null;

export default function DrawerTestPage() {
  const [open, setOpen] = useState<OpenKey>(null);
  const close = () => setOpen(null);

  return (
    <Container>
      <Col cols={{ lg: 8, md: 6, sm: 4 }} className="mx-auto py-20">
        <Text as="h1" variant="headline" weight="bold" isAdmin>
          Prueba de Drawer
        </Text>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button label="Básico (admin)" onPress={() => setOpen("basic")} isAdmin />
          <Button label="Left" onPress={() => setOpen("left")} isAdmin />
          <Button label="Right" onPress={() => setOpen("right")} isAdmin />
          <Button label="Top" onPress={() => setOpen("top")} isAdmin />
          <Button label="Bottom" onPress={() => setOpen("bottom")} isAdmin />
          <Button label="Con footer" onPress={() => setOpen("footer")} isAdmin />
          <Button label="Ancho fijo 450px" onPress={() => setOpen("customWidth")} isAdmin />
          <Button label="Derecha + footer (admin)" onPress={() => setOpen("rightAdmin")} isAdmin />
          <Button label="Derecha + footer (sin admin)" onPress={() => setOpen("rightNoAdmin")} />
        </div>

        {/* Básico */}
        <Drawer
          isOpen={open === "basic"}
          onClose={close}
          title="Drawer básico"
          isAdmin
        >
          <Text variant="body" isAdmin>
            Contenido del drawer. Revisa que el fondo, el texto, el título y el
            divisor salgan con los colores de tu paleta admin (sin fallback).
          </Text>
        </Drawer>

        {/* Placement left */}
        <Drawer
          isOpen={open === "left"}
          onClose={close}
          placement="left"
          title="Placement: left"
          isAdmin
        >
          <Text variant="body" isAdmin>Se abre desde la izquierda.</Text>
        </Drawer>

        {/* Placement right */}
        <Drawer
          isOpen={open === "right"}
          onClose={close}
          placement="right"
          title="Placement: right"
          isAdmin
        >
          <Text variant="body" isAdmin>Se abre desde la derecha (default).</Text>
        </Drawer>

        {/* Placement top */}
        <Drawer
          isOpen={open === "top"}
          onClose={close}
          placement="top"
          title="Placement: top"
          isAdmin
        >
          <Text variant="body" isAdmin>Se abre desde arriba.</Text>
        </Drawer>

        {/* Placement bottom */}
        <Drawer
          isOpen={open === "bottom"}
          onClose={close}
          placement="bottom"
          title="Placement: bottom"
          isAdmin
        >
          <Text variant="body" isAdmin>Se abre desde abajo.</Text>
        </Drawer>

        {/* Con footer */}
        <Drawer
          isOpen={open === "footer"}
          onClose={close}
          title="Drawer con footer"
          isAdmin
          footer={
            <>
              <Button
                isAdmin
                variant="secondary"
                onPress={close}
                className=" bg-white w-[162px]"
              >
                Cerrar
              </Button>
              <Button
                isAdmin
                variant="primary"
                className="w-[162px]"
                onPress={close}
              >
                Guardar
              </Button>
            </>
          }
        >
          <Text variant="body" isAdmin>
            El footer queda abajo con un divisor superior.
          </Text>
        </Drawer>

        {/* Ancho fijo */}
        <Drawer
          isOpen={open === "customWidth"}
          onClose={close}
          title="Ancho fijo 450px"
          customWidth="450px"
          isAdmin
        >
          <Text variant="body" isAdmin>
            Este panel ignora `size` y usa `customWidth=&quot;450px&quot;`.
          </Text>
        </Drawer>

        {/* Derecha + footer — CON isAdmin */}
        <Drawer
          isOpen={open === "rightAdmin"}
          onClose={close}
          placement="right"
          title="Derecha (admin)"
          isAdmin
          footer={
            <>
              <Button
                isAdmin
                variant="secondary"
                onPress={close}
                className=" bg-white w-[162px]"
              >
                Cerrar
              </Button>
              <Button
                isAdmin
                variant="primary"
                className="w-[162px]"
                onPress={close}
              >
                Guardar
              </Button>
            </>
          }
        >
          <Text variant="body" isAdmin>
            Drawer a la derecha con footer, usando isAdmin.
          </Text>
        </Drawer>

        {/* Derecha + footer — SIN isAdmin */}
        <Drawer
          isOpen={open === "rightNoAdmin"}
          onClose={close}
          placement="right"
          title="Derecha (sin admin)"
          footer={
            <>
              <Button
                variant="secondary"
                onPress={close}
                className=" bg-white w-[162px]"
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                className="w-[162px]"
                onPress={close}
              >
                Guardar
              </Button>
            </>
          }
        >
          <Text variant="body">
            Drawer a la derecha con footer, sin isAdmin.
          </Text>
        </Drawer>
      </Col>
    </Container>
  );
}

"use client";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Drawer,
  Input,
  Switch,
  Text,
} from "citrica-ui-toolkit";

type OpenKey = "admin" | "noAdmin" | null;

export default function App() {
  const [open, setOpen] = useState<OpenKey>(null);
  const [lastAction, setLastAction] = useState<string>("—");
  const close = () => setOpen(null);

  return (
    <Container>
      <Col cols={{ lg: 8, md: 6, sm: 4 }} className="mx-auto py-20">
        <Text as="h1" variant="headline" weight="bold" isAdmin>
          Drawer
        </Text>

        <Text variant="title" weight="bold" isAdmin className="mt-4 block">
          Text isAdmin bold (prueba)
        </Text>

        <Text variant="title" weight="bold" className="mt-2 block">
          Text bold sin admin (prueba)
        </Text>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            label="Con admin"
            variant="primary"
            className="w-[162px]"
            onPress={() => setOpen("admin")}
            isAdmin
          />
          <Button
            label="Sin admin"
            variant="primary"
            className="w-[162px]"
            onPress={() => setOpen("noAdmin")}
          />
        </div>

        {/* Switches de prueba */}
        <div className="mt-10 flex flex-col gap-4">
          <Text variant="subtitle" weight="bold" isAdmin>
            Switch
          </Text>

          <div className="flex flex-wrap items-center gap-6">
            <Switch defaultSelected isAdmin variant="primary">
              Admin primary
            </Switch>
            <Switch defaultSelected isAdmin variant="success">
              Admin success
            </Switch>
            <Switch defaultSelected isAdmin variant="danger">
              Admin danger
            </Switch>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Switch defaultSelected variant="primary">
              Web primary
            </Switch>
            <Switch defaultSelected variant="success">
              Web success
            </Switch>
            <Switch variant="warning">Web warning (off)</Switch>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Switch isAdmin size="sm" defaultSelected>
              sm
            </Switch>
            <Switch isAdmin size="md" defaultSelected>
              md
            </Switch>
            <Switch isAdmin size="lg" defaultSelected>
              lg
            </Switch>
            <Switch isAdmin isDisabled defaultSelected>
              disabled
            </Switch>
          </div>
        </div>

        {/* Dropdown de prueba */}
        <div className="mt-10 flex flex-col gap-4">
          <Text variant="subtitle" weight="bold" isAdmin>
            Dropdown
          </Text>

          <div className="flex flex-wrap items-center gap-6">
            <Dropdown
              isAdmin
              trigger={
                <Button
                  isAdmin
                  isIconOnly
                  variant="flat"
                  startIcon="EllipsisVertical"
                />
              }
              items={[
                { key: "edit", label: "Editar" },
                { key: "access", label: "Accesos" },
                { key: "delete", label: "Eliminar", color: "danger" },
              ]}
              onAction={(key) => setLastAction(key)}
            />

            <Text variant="body" isAdmin>
              Última acción: <b>{lastAction}</b>
            </Text>
          </div>
        </div>

        {/* Drawer CON isAdmin */}
        <Drawer
          isOpen={open === "admin"}
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
          <div className="flex flex-col gap-2">
            <Text variant="body" isAdmin>
              Drawer a la derecha con footer, usando isAdmin.
            </Text>
            <Input isAdmin label="Nombre" placeholder="Escribe tu nombre" />
            <Input isAdmin label="Correo" placeholder="tucorreo@ejemplo.com" />
          </div>
        </Drawer>

        {/* Drawer SIN isAdmin */}
        <Drawer
          isOpen={open === "noAdmin"}
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
              <Button variant="primary" className="w-[162px]" onPress={close}>
                Guardar
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-2">
            <Text variant="body">
              Drawer a la derecha con footer, sin isAdmin.
            </Text>
            <Input label="Nombre" placeholder="Escribe tu nombre" />
            <Input label="Correo" placeholder="tucorreo@ejemplo.com" />
          </div>
        </Drawer>
      </Col>
    </Container>
  );
}

"use client";
import React from "react";
import { Divider } from "@heroui/divider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Text } from "../../atoms/Text";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import type { ExportModalProps } from "./types";

// Textos por defecto (español). Overridables vía `labels`.
const DEFAULTS = {
  exportTitle: "EXPORTAR TABLA",
  exportFormatLabel: "Formato seleccionado:",
  exportFileNameLabel: "Nombre del archivo",
  exportFileNamePlaceholder: "Ingrese el nombre del archivo",
  exportFileNameHint: "El nombre por defecto incluye la fecha actual.",
  exportCancel: "Cancelar",
  exportConfirm: "Exportar",
  exportConfirming: "Exportando...",
};

// Tokens como CSS vars con fallback. Se inyectan en el nodo del portal
// (ModalContent) porque el modal se renderiza fuera del árbol del contenedor.
const getExportModalVars = (isAdmin: boolean): React.CSSProperties => {
  const p = isAdmin ? "admin-" : "";

  return {
    "--ct-em-primary": `var(--color-${p}primary, #083D77)`,
    "--ct-em-body": `var(--color-${p}surface, #E2E6E1)`,
    "--ct-em-outline": `var(--color-${p}outline, #9FB2C0)`,
  } as React.CSSProperties;
};

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  exportFormat,
  fileName,
  onFileNameChange,
  onConfirm,
  isLoading = false,
  isAdmin = false,
  labels,
}) => {
  const t = { ...DEFAULTS, ...labels };
  const vars = getExportModalVars(isAdmin);

  return (
    <Modal className="w-[360px]" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent style={vars}>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 h-[64px] bg-white">
              <Text
                color="var(--ct-em-primary)"
                isAdmin={isAdmin}
                variant="subtitle"
                weight="bold"
              >
                {t.exportTitle}
              </Text>
            </ModalHeader>
            <ModalBody className="bg-[var(--ct-em-body)] h-[156px]">
              <div className="flex flex-col gap-4">
                <p>
                  <Text
                    color="var(--ct-em-primary)"
                    isAdmin={isAdmin}
                    variant="body"
                    weight="bold"
                  >
                    {t.exportFormatLabel}{" "}
                  </Text>
                  <Text
                    className="!uppercase"
                    color="var(--ct-em-primary)"
                    isAdmin={isAdmin}
                    variant="body"
                    weight="bold"
                  >
                    {exportFormat}
                  </Text>
                </p>
                <Divider className="bg-[var(--ct-em-outline)]" />
                <div className="mb-4">
                  <Input
                    classNames={{
                      inputWrapper:
                        "!border-[color:var(--ct-em-outline)] !rounded-[12px] data-[hover=true]:!border-[color:var(--ct-em-primary)]",
                      label: "!text-[color:var(--ct-em-primary)]",
                      input:
                        "placeholder:text-[color:var(--ct-em-outline)] !text-[color:var(--ct-em-primary)]",
                    }}
                    label={t.exportFileNameLabel}
                    placeholder={t.exportFileNamePlaceholder}
                    value={fileName}
                    variant="faded"
                    onChange={(e) => onFileNameChange(e.target.value)}
                  />
                  <span className="bg-[var(--ct-em-body)] block">
                    <Text
                      color="var(--ct-em-outline)"
                      isAdmin={isAdmin}
                      variant="label"
                    >
                      {t.exportFileNameHint}
                    </Text>
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="h-[72px] flex justify-center">
              <Button
                isAdmin={isAdmin}
                isDisabled={isLoading}
                variant="secondary"
                onPress={onCloseModal}
              >
                {t.exportCancel}
              </Button>
              <Button
                className="bg-[var(--ct-em-primary)]"
                isAdmin={isAdmin}
                isDisabled={!fileName.trim() || isLoading}
                isLoading={isLoading}
                variant="primary"
                onPress={onConfirm}
              >
                {isLoading ? t.exportConfirming : t.exportConfirm}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;

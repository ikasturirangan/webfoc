"use client";

import { useSerialPort } from "@/lib/serialContext";
import { KeyboardEventHandler, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "../ui/toast"; // Importing toast components

export const SerialCommandPrompt = () => {
  const serial = useSerialPort();
  const [promptValue, setPromptValue] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"default" | "destructive">(
    "default"
  );

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.code === "Enter" && serial) {
      serial.send(promptValue).catch((error) => {
        setToastMessage(`Failed to send command: ${error.message}`);
        setToastType("destructive");
        setToastOpen(true);
      });
      setPromptValue("");
    }
  };

  const handleStoredCommandClick = (command: string) => () => {
    serial
      ?.send(command)
      .catch((error) => {
        setToastMessage(`Failed to send command: ${error.message}`);
        setToastType("destructive");
        setToastOpen(true);
      });
  };

  const handleRestart = () => {
    serial
      ?.restartTarget()
      .catch((error) => {
        setToastMessage(`Failed to restart target: ${error.message}`);
        setToastType("destructive");
        setToastOpen(true);
      });
  };

  return (
    <ToastProvider>
      <div className="flex flex-col gap-4 w-full">
        <Input
          disabled={!serial}
          placeholder="Command"
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleRestart} className="font-bold text-sm">
            Restart
          </Button>
          <Button
            onClick={handleStoredCommandClick("NMS01100011")}
            className="font-bold text-sm"
          >
            Enable Monitoring
          </Button>
          <Button
            onClick={handleStoredCommandClick("NMC")}
            className="font-bold text-sm"
          >
            Disable Monitoring
          </Button>
        </div>
        <ToastViewport />
        <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastType}>
          <div className="flex items-center">
            <div className="mr-2">
              <ToastTitle>{toastType === "destructive" ? "Error" : "Info"}</ToastTitle>
              <ToastDescription>{toastMessage}</ToastDescription>
            </div>
            <ToastClose />
          </div>
        </Toast>
      </div>
    </ToastProvider>
  );
};

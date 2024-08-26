"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SerialCommandPrompt } from "./serialcommandprompt";
import { SerialOutputViewer } from "./SerialOutputViewer";
import { useAvailablePorts } from "@/lib/useAvailablePorts";
import { SimpleFocSerialPort } from "@/simpleFoc/serial";
import SerialPort from "serialport";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Importing toast components

const BAUD_RATES = [
  300, 1200, 2400, 4800, 9600, 11200, 19200, 38400, 57600, 74880, 115200, 230400, 250000, 921600,
];

export const SerialManager = ({
  onSetSerial,
  serial,
  ...other
}: {
  serial: SimpleFocSerialPort | null;
  onSetSerial: (serial: SimpleFocSerialPort | null) => any;
}) => {
  const [baudRate, setBaudRate] = useState(BAUD_RATES[1]);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const ports = useAvailablePorts();

  const handleConnect = async (port?: SerialPort) => {
    const serial = new SimpleFocSerialPort(baudRate);
    setLoading(true);
    try {
      await serial.open(port);
      onSetSerial(serial);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to open serial port:", error);
        setToastMessage(`Failed to open serial port: ${error.message}`);
        setToastOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await serial?.close();
      onSetSerial(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to close serial port:", error);
        setToastMessage(`Failed to close serial port: ${error.message}`);
        setToastOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <Card className="flex flex-col lg:max-w-full p-4" {...other}>
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="loader"></div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 [&>div]:flex-1">
          <CardTitle className="flex font-bold items-baseline gap-1 text-md tabular-nums">
            Serial Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col">
            <Select onValueChange={(value) => setBaudRate(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Baud Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Baud Rates</SelectLabel>
                  {BAUD_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              className="font-bold w-full"
              onClick={() => handleConnect()}
              disabled={!!serial && !!serial.port}
            >
              {loading ? "Connecting..." : "Connect"}
            </Button>
            <Button
              variant="destructive"
              className="font-bold w-full"
              onClick={handleDisconnect}
              disabled={!serial || !serial.port}
            >
              {loading ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
          {!!ports.length && (
            <div className="space-y-2">
              <div>
                <p className="font-bold text-sm"> Previously connected: </p>
              </div>
              {ports.map((port, i) => (
                <Button
                  variant={"outline"}
                  key={i}
                  className="font-bold w-full"
                  onClick={() => handleConnect(port)}
                  disabled={!!serial && !!serial.port}
                >
                  {`${port.getInfo().usbVendorId} - ${port.getInfo().usbProductId}`}
                </Button>
              ))}
            </div>
          )}
          <div className="flex flex-col mt-4">
            <SerialOutputViewer />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <SerialCommandPrompt />
        </CardFooter>
        <ToastViewport />
        <Toast open={toastOpen} onOpenChange={setToastOpen} variant="destructive">
          <div className="flex items-center">
            <div className="mr-2">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{toastMessage}</ToastDescription>
            </div>
            <ToastClose />
          </div>
        </Toast>
      </Card>
    </ToastProvider>
  );
};

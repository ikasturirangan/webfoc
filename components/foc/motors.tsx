"use client";

import { useState } from "react";
import { useSerialPortOpenStatus } from "@/lib/serialContext";
import { useSerialIntervalSender } from "@/lib/useSerialIntervalSender";
import { useSerialLineEvent } from "@/lib/useSerialLineEvent";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { MotorMonitorGraph } from "./motormonitorgraph";
import { MotorControlTypeSwitch } from "../Parameters/MotorControlTypeSwitch";
import { FocScalar } from "../Parameters/FocScalar";
import { FocBoolean } from "../Parameters/FocBoolean";
import { Loader2Icon } from "lucide-react";

const MOTOR_OUTPUT_REGEX = /^\?(\w):(.*)\r?$/;

export const Motors = () => {
  const [motors, setMotors] = useState<{ [key: string]: string }>({});
  const portOpen = useSerialPortOpenStatus();

  useSerialIntervalSender("?", 10000);
  useSerialLineEvent((line) => {
    const match = line.content.match(MOTOR_OUTPUT_REGEX);
    if (match) {
      setMotors((m) => ({
        ...m,
        [match[1]]: match[2],
      }));
    }
  });

  const renderMotorControls = (key: string, name: string) => (
    <Card key={key}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{name}</CardTitle>
        <FocBoolean
          command="E"
          label="Enabled"
          motorKey={key}
          offLabel="Off"
          onLabel="On"
          offValue="0"
          onValue="1"
        />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="control">
            <AccordionTrigger className="font-bold">Control</AccordionTrigger>
            <AccordionContent>
              <MotorControlTypeSwitch motorKey={key} />
              <FocScalar motorKey={key} command="" label="Target" defaultMin={-20} defaultMax={20} step={0.01} />
              <FocScalar motorKey={key} command="CD" label="Motion loop downsample" defaultMin={0} defaultMax={30} step={1} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="velocity-pid">
            <AccordionTrigger className="font-bold">Velocity PID</AccordionTrigger>
            <AccordionContent>
              <FocScalar motorKey={key} command="VP" label="Proportional" defaultMin={0} defaultMax={5} step={0.01} />
              <FocScalar motorKey={key} command="VI" label="Integral" defaultMin={0} defaultMax={40} step={0.01} />
              <FocScalar motorKey={key} command="VD" label="Derivative" defaultMin={0} defaultMax={1} step={0.0001} />
              <FocScalar motorKey={key} command="VR" label="Output Ramp" defaultMin={0} defaultMax={10000} step={0.0001} />
              <FocScalar motorKey={key} command="VL" label="Output Limit" defaultMin={0} defaultMax={24} step={0.0001} />
              <FocScalar motorKey={key} command="VF" label="Filtering" defaultMin={0} defaultMax={0.2} step={0.001} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="angle-pid">
            <AccordionTrigger className="font-bold">Angle PID</AccordionTrigger>
            <AccordionContent>
              <FocScalar motorKey={key} command="AP" label="Proportional" defaultMin={0} defaultMax={5} step={0.01} />
              <FocScalar motorKey={key} command="AL" label="Output Limit" defaultMin={0} defaultMax={24} step={0.0001} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <MotorMonitorGraph motorKey={key} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {portOpen && Object.keys(motors).length === 0 && (
        <div className="flex flex-col items-center gap-4">
          <div>
            <Loader2Icon className="animate-spin" />
          </div>
          <h4 className="text-gray-600 font-semibold">Waiting for motors list from controller...</h4>
          <p className="text-gray-600 font-semibold">Make sure to use machine_readable verbose mode</p>
        </div>
      )}
      {Object.keys(motors).length === 0 && renderMotorControls("default", "Motor")}
      {Object.entries(motors).map(([key, name]) => renderMotorControls(key, name))}
    </div>
  );
};

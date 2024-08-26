"use client";

import { useState } from "react";
import { useSerialPortRef } from "../../lib/serialContext";
import { useSerialIntervalSender } from "../../lib/useSerialIntervalSender";
import { useSerialLineEvent } from "../../lib/useSerialLineEvent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";


const CONTROL_VALUES = ["torque", "vel", "angle", "vel open", "angle open"];

const CONTROL_VALUE_TO_INDEX: { [key: string]: number } = {
  torque: 0,
  vel: 1,
  angle: 2,
  "vel open": 3,
  "angle open": 4,
};

export const MotorControlTypeSwitch = ({ motorKey }: { motorKey: string }) => {
  const fullCommandString = `${motorKey}C`;
  const [value, setValue] = useState<string | undefined>(undefined);
  const serialRef = useSerialPortRef();

  const handleChange = (val: string) => {
    serialRef.current?.send(`${fullCommandString}${CONTROL_VALUE_TO_INDEX[val]}`);
    setValue(val);
  };

  useSerialLineEvent((line) => {
    if (
      line.content.startsWith(fullCommandString) &&
      CONTROL_VALUES.some((val) => line.content === `${fullCommandString}${val}`)
    ) {
      const receivedValue = line.content.slice(fullCommandString.length);
      setValue(receivedValue);
    }
  });
  useSerialIntervalSender(fullCommandString, 5000);

  return (
    <Tabs defaultValue={value} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger className="font-bold text-sm" value="torque">Torque</TabsTrigger>
        <TabsTrigger className="font-bold text-sm" value="vel">Velocity</TabsTrigger>
        <TabsTrigger className="font-bold text-sm" value="angle">Angle</TabsTrigger>
        <TabsTrigger className="font-bold text-sm" value="vel open">Velocity Open</TabsTrigger>
        <TabsTrigger className="font-bold text-sm" value="angle open">Angle Open</TabsTrigger>
      </TabsList>
      <TabsContent value="torque"></TabsContent>
      <TabsContent value="vel"></TabsContent>
      <TabsContent value="angle"></TabsContent>
      <TabsContent value="vel open"></TabsContent>
      <TabsContent value="angle open"></TabsContent>
    </Tabs>
  );
};

import { useState } from "react";
import { useSerialPort } from "../../lib/serialContext";
import { useSerialIntervalSender } from "../../lib/useSerialIntervalSender";
import { useSerialLineEvent } from "../../lib/useSerialLineEvent";
import { Switch } from "../ui/switch";

export const FocBoolean = (props: {
  label: string;
  motorKey: string;
  onLabel: string;
  offLabel: string;
  command: string;
  onValue: string;
  offValue: string;
}) => {
  const fullCommandString = `${props.motorKey}${props.command}`;

  const [value, setValue] = useState(false);
  const serialPort = useSerialPort();
  useSerialLineEvent((line) => {
    if (line.content.startsWith(fullCommandString)) {
      const receivedValue = line.content.slice(fullCommandString.length);
      if (receivedValue !== props.onValue && receivedValue !== props.offValue) {
        console.warn(
          `Received value for motor ${props.motorKey} and command ${props.command} which doesn't match on or off value: ${line.content}`,
          { onValue: props.onValue, offValue: props.offValue }
        );
        return;
      }
      setValue(receivedValue === props.onValue ? true : false);
    }
  });

  const onChange = (checked: boolean) => {
    serialPort?.send(
      `${fullCommandString}${checked ? props.onValue : props.offValue}`
    );
    setValue(checked);
  };

  useSerialIntervalSender(fullCommandString, 5000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 m-20">
      <h1 className="font-semibold text-sm">{props.offLabel}</h1>
      <Switch checked={value} onCheckedChange={onChange} />
      <h1 className="font-semibold text-sm">{props.onLabel}</h1>
    </div>
  );
};

import React, { useMemo, useState } from "react";
import { throttle } from "lodash-es";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useSerialPortRef } from "@/lib/serialContext";
import { useSerialIntervalSender } from "@/lib/useSerialIntervalSender";
import { useSerialLineEvent } from "@/lib/useSerialLineEvent";
import { useParameterSettings } from "@/lib/useParameterSettings";

interface FocScalarProps {
  motorKey: string;
  command: string;
  label: string;
  defaultMin: number;
  defaultMax: number;
  step: number;
}

export const FocScalar: React.FC<FocScalarProps> = (props) => {
  const fullCommandString = `${props.motorKey}${props.command}`;
  const { expanded, setExpanded, min, setMin, max, setMax } =
    useParameterSettings(fullCommandString, props.defaultMin, props.defaultMax);

  const [targetValue, setTargetValue] = useState<number[]>([0]);
  const serialRef = useSerialPortRef();

  useSerialLineEvent((line) => {
    if (line.content.startsWith(fullCommandString)) {
      const receivedValue = Number(
        line.content.slice(fullCommandString.length)
      );
      if (!isNaN(receivedValue)) {
        setTargetValue([receivedValue]);
      }
    }
  });
  useSerialIntervalSender(fullCommandString, 3000);

  const changeValue = useMemo(
    () =>
      throttle((value: number[]) => {
        serialRef.current?.send(`${fullCommandString}${value[0]}`);
      }, 200),
    [serialRef, fullCommandString]
  );

  const handleSliderChange = (value: number[]) => {
    setTargetValue(value);
    changeValue(value);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between"
        >
          <span>{props.label}</span>
          <Input
            value={targetValue[0]}
            onChange={(e) => handleSliderChange([Number(e.target.value)])}
            type="number"
            className="w-20"
          />
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            <Input
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              type="number"
              className="w-20"
            />
            <Slider
              value={targetValue}
              onValueChange={handleSliderChange}
              min={min}
              max={max}
              step={props.step}
              className="flex-1"
            />
            <Input
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              type="number"
              className="w-20"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

import React, { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { useSerialPortLines } from "@/lib/serialContext";
import { SerialLine } from "@/simpleFoc/serial";

const SerialLineDisplay = ({
  index,
  style,
  data,
}: {
  index: number;
  style: any;
  data: SerialLine[];
}) => (
  <div
    style={style}
    className="line-height-[20px] text-[13px] px-[10px] font-mono"
  >
    {data[index].type === "received" ? "➡️" : "⬅️"}
    &nbsp;
    {data[index].content}
  </div>
);

const serialLinesToKey = (index: number, data: SerialLine[]) => {
  return data[index].index;
};

export const SerialOutputViewer = () => {
  const listRef = useRef<any>();
  const listOuterRef = useRef<any>();
  const lines = useSerialPortLines();

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    if (
      listOuterRef.current &&
      listOuterRef.current.scrollHeight -
        (listOuterRef.current.scrollTop + listOuterRef.current.clientHeight) <
        300
    ) {
      listRef.current.scrollToItem(lines.length ? lines.length - 1 : 0);
    }
  }, [lines]);

  return (
    <div className="rounded overflow-hidden">
      <div className="h-[300px] overflow-auto bg-background">
        <List
          itemData={lines}
          itemCount={lines.length}
          height={300}
          itemSize={20}
          width="100%"
          itemKey={serialLinesToKey}
          ref={listRef}
          outerRef={listOuterRef}
        >
          {SerialLineDisplay}
        </List>
      </div>
    </div>
  );
}
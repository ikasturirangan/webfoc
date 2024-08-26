"use client";
import { Header } from "@/components/root/header";
import { SerialManager } from "@/components/foc/SerialManager";
import { Footer } from "@/components/root/footer";
import { SimpleFocSerialPort } from "@/simpleFoc/serial";
import { useState } from "react";
import { serialPortContext } from "@/lib/serialContext";
import { Motors } from "@/components/foc/motors";



export default function Dash() {
  const [serial, setSerial] = useState<SimpleFocSerialPort | null>(null);

 
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-5">
      <serialPortContext.Provider value={serial}>
          <SerialManager onSetSerial={setSerial} serial={serial} />
          <Motors/>
       </serialPortContext.Provider>      
    </div>
     
      <Footer />
    </>
  );
}

"use client";
import { ChangeEvent, useState } from "react";

import Card from "./card";
import Toolbar from "./toolbar";
import { TDimensions } from "./card/card.types";

export default function CardContainer() {
  const [dimensions, setDimensions] = useState<TDimensions>({
    width: 400,
    height: 400,
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <Toolbar value={dimensions} handleChange={handleChange} />
      <Card setDimensions={setDimensions} />
    </>
  );
}

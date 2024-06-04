"use client";
import { ChangeEvent, useState } from "react";

import Card from "./card";
import Toolbar from "./toolbar";

export default function CardContainer() {
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <Toolbar value={dimensions} handleChange={handleChange} />
      <Card dimensions={dimensions} />
    </>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function PawProvider({ children }) {
  const [frame, setFrame] = useState(0);
  const [bw, setBw] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [strip, setStrip] = useState(null);

  const reset = () => {
    setPhotos([]);
    setStrip(null);
  };

  return (
    <Ctx.Provider
      value={{ frame, setFrame, bw, setBw, photos, setPhotos, strip, setStrip, reset }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const usePaw = () => useContext(Ctx);

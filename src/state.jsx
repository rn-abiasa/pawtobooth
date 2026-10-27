/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

// posisi crop tiap foto dalam persen (50 = tengah), sama seperti object-position
const defaultCrops = () => Array.from({ length: 4 }, () => ({ x: 50, y: 50 }));

export function PawProvider({ children }) {
  const [frame, setFrame] = useState(0);
  const [bw, setBw] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [source, setSource] = useState("camera"); // "camera" | "upload"
  const [crops, setCrops] = useState(defaultCrops);
  const [strip, setStrip] = useState(null);

  const begin = (list, src) => {
    setPhotos(list);
    setSource(src);
    setCrops(defaultCrops());
    setStrip(null);
  };

  const reset = () => {
    setPhotos([]);
    setSource("camera");
    setCrops(defaultCrops());
    setStrip(null);
  };

  return (
    <Ctx.Provider
      value={{
        frame, setFrame, bw, setBw,
        photos, setPhotos, source, crops, setCrops,
        strip, setStrip, begin, reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const usePaw = () => useContext(Ctx);

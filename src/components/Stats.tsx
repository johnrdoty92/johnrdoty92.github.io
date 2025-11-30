import { addAfterEffect, addEffect } from "@react-three/fiber";
import { useEffect, useState } from "react";
import StatsModule from "three/examples/jsm/libs/stats.module.js";

export const Stats = () => {
  const [stats] = useState(() => new StatsModule());
  useEffect(() => {
    document.body.append(stats.dom);
    const begin = addEffect(() => stats.begin());
    const end = addAfterEffect(() => stats.end());
    return () => {
      document.body.removeChild(stats.dom);
      begin();
      end();
    };
  }, [stats]);
  return null;
};

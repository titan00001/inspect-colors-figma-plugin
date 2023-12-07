import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { Paints } from "./@types";
import ColorTable from "./components/colorTable";

const UI: React.FC = () => {
  const [paints, setPaints] = useState<Paints>();

  onmessage = async (event: MessageEvent) => {
    const pluginMessage = event.data.pluginMessage;
    console.log({ pluginMessage });
    if (pluginMessage.type === "solid-paints") {
      setPaints(pluginMessage);
    }
  };
  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Inspect Colors
        </div>
      </div>
      <hr />

      {paints?.fillPaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Fill Colors Used in Current Page
          </p>
          <ColorTable colors={paints.fillPaints} />
        </div>
      )}

      {paints?.strokePaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Stroke Colors Used in Current Page
          </p>
          <ColorTable colors={paints.strokePaints} />
        </div>
      )}

      {paints?.linearGradients.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Linear gradients Used in Current Page
          </p>
          <ColorTable colors={paints.linearGradients} />
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("react-page"));

root.render(<UI />);

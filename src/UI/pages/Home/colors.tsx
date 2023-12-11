import React, { useContext } from "react";
import ColorTable from "../../components/colorTable";
import { StylesContext } from "../../context/styles.context";

const ColorTab: React.FC = () => {
    const {currentPageStyles} = useContext(StylesContext);
  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Inspect Colors
        </div>
      </div>
      <hr />

      {currentPageStyles?.fillPaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Fill Colors Used in Current Page
          </p>
          <ColorTable colors={currentPageStyles.fillPaints} />
        </div>
      )}

      {currentPageStyles?.strokePaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Stroke Colors Used in Current Page
          </p>
          <ColorTable colors={currentPageStyles.strokePaints} />
        </div>
      )}

      {currentPageStyles?.linearGradients.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Linear gradients Used in Current Page
          </p>
          <ColorTable colors={currentPageStyles.linearGradients} />
        </div>
      )}
    </div>
  );
};

export default ColorTab;

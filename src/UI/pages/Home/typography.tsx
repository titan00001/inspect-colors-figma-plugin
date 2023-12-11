import React, { useContext } from "react";
import FontsList from "../../components/typographyTable";
import StylesContext from "../../context/styles.context";

const TypographyTab: React.FC = () => {
  const {currentPageStyles} = useContext(StylesContext);
  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Inspect Typography
        </div>
      </div>

      {currentPageStyles?.fonts.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Typography Used in Current Page
          </p>
          <FontsList fonts={currentPageStyles.fonts} />
        </div>
      )}
    </div>
  );
};

export default TypographyTab;

import React, { useContext } from "react";
import ColorTable from "../../components/colorTable";
import { StylesContext } from "../../context/styles.context";
import MenuDropdown from "../../components/menu";
import { TSelection } from "../../../@types";
import { MENU_ITEMS } from "../../../constants";

const ColorTab: React.FC = () => {
    const {currentPageStyles, selectedPagesStyles, selectedMenu, setSelection} = useContext(StylesContext);
    const pageStyles = selectedMenu === "COMBINED_PAGE" ? selectedPagesStyles : currentPageStyles;
  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Inspect Colors
        </div>

        <div>
            <MenuDropdown menuItems={MENU_ITEMS} onMenuSelect={(choice) => setSelection(choice.value as TSelection)} label={MENU_ITEMS.find(m => m.value === selectedMenu).name} />
        </div>
      </div>
      <hr />

      {pageStyles?.fillPaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Fill Colors
          </p>
          <ColorTable colors={[...pageStyles.fillPaints, ...pageStyles.orphan.fillPaints]} />
        </div>
      )}

      {pageStyles?.strokePaints.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Stroke Colors
          </p>
          <ColorTable colors={[...pageStyles.strokePaints, ...pageStyles.orphan.strokePaints]} />
        </div>
      )}

      {pageStyles?.linearGradients.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Linear gradients
          </p>
          <ColorTable colors={[...pageStyles.linearGradients, ...pageStyles.orphan.linearGradients]} />
        </div>
      )}
    </div>
  );
};

export default ColorTab;

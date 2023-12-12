import React, { useContext } from "react";
import FontsList from "../../components/typographyTable";
import StylesContext from "../../context/styles.context";
import { TSelection } from "../../../@types";
import { MENU_ITEMS } from "../../../constants";
import MenuDropdown from "../../components/menu";

const TypographyTab: React.FC = () => {
    const {currentPageStyles, selectedPagesStyles, selectedMenu, setSelection} = useContext(StylesContext);
    const pageStyles = selectedMenu === "COMBINED_PAGE" ? selectedPagesStyles : currentPageStyles;
  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Inspect Typography
        </div>

        <div>
            <MenuDropdown menuItems={MENU_ITEMS} onMenuSelect={(choice) => setSelection(choice.value as TSelection)} label={MENU_ITEMS.find(m => m.value === selectedMenu).name} />
        </div>
      </div>

      {pageStyles?.fonts.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <p className="text-black font-bold text-lg mb-4">
            Typography
          </p>
          <FontsList fonts={pageStyles.fonts} />
        </div>
      )}
    </div>
  );
};

export default TypographyTab;

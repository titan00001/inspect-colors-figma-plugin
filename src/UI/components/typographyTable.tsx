import React from "react";
import { FontContent } from "../../@types";

export interface IFontTableProps {
  fonts: FontContent[];
}

// Define the FontComponent function
const FontComponent = ({ fontContent }: { fontContent: FontContent }) => {
    const { id, name, font, usedBy } = fontContent;
    const { fontFamily, fontSize, fontWeight, lineHeight, fontStyle } = font;
  
    // Generate a unique key for the component based on the id
    const key = `font-${id}`;
  
    // Build the font style string
    const fontStyleString = `${fontStyle} ${fontWeight}`;

    // Adjust lineHeight based on the unit
    let lineHeightValue;
    if (lineHeight.unit === "AUTO") {
        lineHeightValue = "AUTO";
    } else if(lineHeight.unit === "PIXELS") {
        lineHeightValue = `${Math.round(lineHeight.value)}px`;
    } else if(lineHeight.unit === "PERCENT") {
        lineHeightValue = `${Math.round(lineHeight.value)}%`;
    }
  
    return (
      <div key={key} className="flex gap-x-2 items-center px-2 py-1">
        <div className="w-[30%] text-sm font-medium text-gray-500">{name}</div>
        <div className="w-[20%] text-sm font-medium text-gray-500">
          {fontFamily.family}
        </div>
        <div className="w-[20%] text-sm font-medium text-gray-500">
          {fontSize}px
        </div>
        <div className="w-[20%] text-sm font-medium text-gray-500">
          {lineHeightValue}
        </div>
        <div className="w-[20%] text-sm font-medium text-gray-500">
          {fontStyleString}
        </div>
        <div className="w-[20%] text-sm font-medium text-gray-500">
          {usedBy.toString() ?? 0}
        </div>
      </div>
    );
  };
  
  const FontsList: React.FC<IFontTableProps> = ({ fonts }) => {
    return (
      <div className="flex min-w-[280px] overflow-x-auto flex-col gap-y-1 gap-x-2 border border-gray-200 rounded-lg">
        <div className="flex gap-x-2 items-center bg-gray-100 px-2 py-4 rounded-t-lg">
          <div className="w-[30%] text-base font-semibold text-gray-600">
            Name
          </div>
          <div className="w-[20%] text-base font-semibold text-gray-600">
            Font Family
          </div>
          <div className="w-[20%] text-base font-semibold text-gray-600">
            Size
          </div>
          <div className="w-[20%] text-base font-semibold text-gray-600">
            Line Height
          </div>
          <div className="w-[20%] text-base font-semibold text-gray-600">
            Style
          </div>
          <div className="w-[20%] text-base font-semibold text-gray-600">
            Used By
          </div>
        </div>
        {fonts.map((fontItem) => (
          <FontComponent key={fontItem.id} fontContent={fontItem} />
        ))}
      </div>
    );
  };
  
export default FontsList;

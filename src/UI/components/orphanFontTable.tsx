import React from "react";
import { OrphanFontPayload } from "../../@types";

export interface IFontTableProps {
  fonts: OrphanFontPayload[];
}

// Define the OrphanFontComponent function
const OrphanFontComponent = ({ fontContent }: { fontContent: OrphanFontPayload }) => {
    const { name, value, usedBy } = fontContent;
  
    // Generate a unique key for the component based on the id
    const key = `font-${value}`;
  
    return (
      <div key={key} className="flex gap-x-2 items-center px-2 py-1">
        <div className="w-[50%] text-sm font-medium text-gray-500">{name}</div>
        <div className="w-[50%] text-sm font-medium text-gray-500">
          {usedBy.toString() ?? 0}
        </div>
      </div>
    );
  };
  
  const OrphanFontsList: React.FC<IFontTableProps> = ({ fonts }) => {
    return (
      <div className="flex min-w-[280px] overflow-x-auto flex-col gap-y-1 gap-x-2 border border-gray-200 rounded-lg">
        <div className="flex gap-x-2 items-center bg-gray-100 px-2 py-4 rounded-t-lg">
          <div className="w-[50%] text-base font-semibold text-gray-600">
            Name
          </div>
          <div className="w-[50%] text-base font-semibold text-gray-600">
            Used By
          </div>
        </div>
        {fonts.map((fontItem) => (
          <OrphanFontComponent key={fontItem.value} fontContent={fontItem} />
        ))}
      </div>
    );
  };
  
export default OrphanFontsList;

import React from "react";
import { ColorContent } from "../../@types";

export interface IColorTableProps {
  colors: ColorContent[];
}

const ColorTable: React.FC<IColorTableProps> = ({ colors }) => {
  return (
    <div className="flex flex-col gap-y-1 gap-x-2 border border-gray-200 rounded-lg">
      <div className="flex gap-x-2 h-[24px] items-center bg-gray-100 px-2 py-4 rounded-t-lg">
        <div className="flex-1 text-base font-semibold text-gray-600">Name</div>
        <div className="w-[20%] text-base font-semibold text-gray-600">Value</div>
        <div className="w-[20%] text-base font-semibold text-gray-600">Color</div>
        <div className="w-[20%] text-base font-semibold text-gray-600">
          Used By
        </div>
      </div>
      {colors.map((colorItem, index) => (
        <div key={index} className="flex gap-x-2 items-center px-2 py-1 ">
          <div className="flex-1 text-sm font-medium text-gray-500">
            {colorItem.name}
          </div>
          <div className="w-[20%] text-sm font-medium text-gray-500">
            {colorItem.color?.color}
          </div>
          <div className="w-[20%]">
            {colorItem.color?.color && <div
              className="w-5 h-5 p-1 rounded-sm border border-gray-500"
              style={{ backgroundColor: colorItem.color.color }}
            ></div>}
          </div>
          <div className="w-[20%] text-sm font-medium text-gray-500">
            {colorItem.usedBy?.toString() ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorTable;

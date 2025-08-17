
import React from "react";

type DropDownProps = {
  options: string[];
  onSelect: (value: string) => void;
  selectedOption: string;
  poseImages: Record<string, string>;
};

const DropDown: React.FC<DropDownProps> = ({ options, onSelect, selectedOption, poseImages }) => {
  return (
    <div className="flex items-center justify-center my-6">
      <select
        value={selectedOption}
        onChange={(e) => onSelect(e.target.value)}
        className="border-2 border-primary-300 rounded-xl px-5 py-2 text-base font-semibold bg-white text-primary-900 shadow focus:border-primary-500 outline-none min-w-[200px] transition-colors"
      >
        {options.map((option: string) => (
          <option key={option} value={option} className="px-3 py-2 bg-white text-primary-700 font-semibold">
            {option}
          </option>
        ))}
      </select>
      <img
        src={poseImages[selectedOption]}
        alt={selectedOption}
        className="w-12 h-12 object-contain ml-4 rounded-xl border-2 border-primary-300 shadow bg-primary-50"
      />
    </div>
  );
};

export default DropDown;

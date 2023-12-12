import React, { FC } from 'react';

interface CheckboxProps {
  onClick?: () => void;
  isChecked: boolean;
  disabled?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({ onClick, isChecked, disabled = false }) => {
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleClick}
        disabled={disabled}
        className="form-checkbox h-3 w-3 text-indigo-600 focus:outline-none focus:ring focus:border-indigo-300"
      />
    </label>
  );
};

export default Checkbox;
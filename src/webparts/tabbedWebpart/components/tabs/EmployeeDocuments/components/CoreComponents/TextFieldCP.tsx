import * as React from 'react';
import { TextField } from '@fluentui/react';

interface ITextFieldCPProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  errorMessage?: string;
}

export const TextFieldCP: React.FC<ITextFieldCPProps> = ({ label, value, onChange, errorMessage }) => {
  const onInputChange = (_: any, newValue?: string) => {
    if (!newValue || /^\d{0,4}$/.test(newValue)) {
      onChange(newValue || '');
    }
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={onInputChange}
      errorMessage={errorMessage}
    />
  );
};
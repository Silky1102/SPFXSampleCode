import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackProps, IStackStyles ,IStackTokens} from '@fluentui/react/lib/Stack';
import {
  DatePicker,
    defaultDatePickerStrings
} from '@fluentui/react/lib/DatePicker';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import  { IEmployee } from '../types/IEmployee';




interface IEmployeeFormProps {
  onSaved: (employee: IEmployee) => void;
  selectedEmployee?: IEmployee | null;
  onReset ?: () => void;
   message?: string | null;
}
const options: IDropdownOption[] = [
  { key: 'HR', text: 'HR' },
  { key: 'IT', text: 'IT' },
  { key: 'Admin', text: 'Admin' }
];

const EmployeeForm  : React.FC <IEmployeeFormProps>= ({ onSaved,selectedEmployee ,onReset,message})  => {
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };
  const stackTokens = { childrenGap: 50 };
  const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
  const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
  };

  const [formData, setFormData] = React.useState<IEmployee>({
    Title: '',
    JoiningDate: '',
    Department: '',
    Experience: ''
  });
  
React.useEffect(() => { 
  if (selectedEmployee) {
    setFormData({
      Title: selectedEmployee.Title,
      JoiningDate: selectedEmployee.JoiningDate,
      Department: selectedEmployee.Department,
      Experience: selectedEmployee.Experience,
      ID: selectedEmployee.ID
    })
  } else {
    handleResetForm();
  }
}, [selectedEmployee]);

  const handleInputChange = (field: keyof IEmployee) => (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || ''
    }));
  };
 
  const handleResetForm = () => {
    setFormData({
      Title: '',
      JoiningDate: '',
      Department: '',
      Experience: ''
    });

    if (onReset) {
      onReset();
    }
  };

  const handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setFormData((prev) => ({
        ...prev,
        Department: option.key as string
      }));
    }
  };

  const handleSubmit =  () => {
    
    try {
      if (!formData.Title || !formData.JoiningDate || !formData.Department || !formData.Experience) {
        const errorMessage = 'Please fill in all fields.';
         setValidationError(errorMessage);
        return;
      }
       onSaved(formData);
      handleResetForm();
    } catch (err) {
      console.error("Error in try block:", err); // 👈 capture real JS error
      
    } 
  };  

  const handleDateChange = (date: Date | null | undefined): void => {
  if (date) {
    setFormData(prev => ({
      ...prev,
      JoiningDate: date.toISOString()
    }));
  }
};

  const stackTokensButtons: IStackTokens = { childrenGap: 10 };

        return (
        <Stack tokens={stackTokens} styles={stackStyles}>
          <Stack horizontal tokens={stackTokens} styles={stackStyles}>
              <Stack {...columnProps}>
                <TextField label="Employee Name" value={formData.Title} onChange={ handleInputChange('Title')} />
                <DatePicker
                    label="Joining Date"
                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    value={formData.JoiningDate ? new Date(formData.JoiningDate) : undefined}
                    onSelectDate={handleDateChange}
                    strings={defaultDatePickerStrings}
                  />
              </Stack>
              <Stack {...columnProps}>
                <Dropdown
                  placeholder="Select an Department"
                  label="Department"
                  options={options}
                  styles={dropdownStyles}
                  onChange={handleDropdownChange}
                  selectedKey={formData.Department ?? null}
                />
                <TextField label="Experience" onChange={handleInputChange('Experience')} value={formData.Experience} />
              </Stack>
            </Stack>

          
            {(validationError || message) && (
            <div style={{ color: (validationError || message)?.startsWith('Failed') ? 'red' : 'green' }}>
                {validationError || message}
            </div>
          )}
          <Stack horizontal tokens={stackTokensButtons}>
            <DefaultButton text="Reset" onClick={handleResetForm}  />
            <PrimaryButton text={selectedEmployee ? 'Update' : 'Add'} onClick={handleSubmit}  />
          </Stack>
        </Stack>
        );
};

export default EmployeeForm;
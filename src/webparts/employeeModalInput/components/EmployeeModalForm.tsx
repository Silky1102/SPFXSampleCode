import * as React from 'react';
import { Modal ,DatePicker,
    defaultDatePickerStrings,
    Dropdown, TextField, IDropdownOption, DefaultButton, 
    PrimaryButton,
    Stack,  IconButton, 
    
} from '@fluentui/react';
import { IEmployee ,IEmployeeFormProps} from '../types/IEmployee';
import { contentStyles, iconButtonStyles,stackTokensButtons, cancelIcon, dropdownStyles, stackTokens, stackStyles, columnProps } from '../styles/ModelStyles';
import { useId } from '@fluentui/react-hooks';


const options: IDropdownOption[] = [
  { key: 'HR', text: 'HR' },
  { key: 'IT', text: 'IT' },
  { key: 'Admin', text: 'Admin' }
];


const EmployeeModalForm  : React.FC <IEmployeeFormProps>= ({onSaved,selectedEmployee ,onReset,message,isModalOpen,onDismiss,handleAddClick})  => {
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<IEmployee>({
        Title: '',
        JoiningDate: '',
        Department: '',
        Experience: ''
    });
  
  const handleInputChange = (field: keyof IEmployee) => (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || ''
    }));
  };
 
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
        setValidationError('Failed : Please fill in all fields.');
       return;
      }
      setValidationError(null); // Clear any previous validation error
      onSaved(formData);
      handleResetForm();
    } catch (err) {
      console.error("Error in try block:", err);
    } 
  };  
const handleModalDismiss = () => {
  setValidationError(null); // Clear the local validation message
   setFormData({
      Title: '',
      JoiningDate: '',
      Department: '',
      Experience: ''
    });
  onDismiss(); // Call the parent dismiss function

};


const handleDateChange = (date: Date | null | undefined): void => {
  if (date) {
    setFormData(prev => ({
      ...prev,
      JoiningDate: date.toISOString()
    }));
  }
};

const titleId = useId('modal-title');
  return (
        <div>
            <DefaultButton onClick={handleAddClick} text="Add Employee" />
        
            <Modal
            titleAriaId={titleId}
            isOpen={isModalOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName={contentStyles.container}
            >
              <div className={contentStyles.header}>
              <h2 className={contentStyles.heading} id={titleId}>
              {selectedEmployee ? 'Update Employee' : 'Add Employee'}
              </h2>
              <IconButton
                  styles={iconButtonStyles}
                  iconProps={cancelIcon}
                  ariaLabel="Close popup modal"
                  onClick={handleModalDismiss} 

              />
              </div>
                  <div className={contentStyles.body}>
                  <Stack tokens={stackTokens} styles={stackStyles}>
                                  <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                                      <Stack {...columnProps}>
                                          <TextField label="Employee Name"
                                           value={formData.Title} 
                                           onChange={ handleInputChange('Title')}  />
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
                                          <TextField label="Experience" 
                                              onChange={handleInputChange('Experience')} 
                                              value={formData.Experience} type='number'
                                          />
                                      </Stack>
                                      </Stack>
                  
                                    {(validationError || message) && (
                                    <div style={{ color: (validationError || message)?.startsWith('Failed') ? 'red' : 'green' }}>
                                        {validationError || message}
                                    </div>
                                  )}
                                  <Stack horizontal   horizontalAlign="end" tokens={stackTokensButtons} style={{ marginTop: 20 }}>
                                      <DefaultButton text="Reset" onClick={handleResetForm}  />
                                      <PrimaryButton text={selectedEmployee ? 'Update' : 'Add'} onClick={handleSubmit}  />
                                  </Stack> 
                                  </Stack>
                  </div>
          <div className={contentStyles.header}></div>    
        </Modal>
    </div>
  );
};

export default EmployeeModalForm;
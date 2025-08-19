import * as React from 'react';
import { Modal ,DatePicker,
    defaultDatePickerStrings,
    Dropdown, TextField, IDropdownOption, DefaultButton, 
    PrimaryButton,
    Stack,  IconButton,
    IIconProps, 
} from '@fluentui/react';
import { IEmployee ,IEmployeeFormProps} from '../types/IEmployee';
//import { contentStyles, iconButtonStyles,stackTokensButtons, cancelIcon, dropdownStyles, stackTokens, stackStyles, columnProps } from '../styles/ModelStyles';
import { useId } from '@fluentui/react-hooks';
import cssStyles from  './TaxanomyEmployeeExample.module.scss';
import  { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react";
// import { BaseComponentContext } from '@microsoft/sp-component-base';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const options: IDropdownOption[] = [
  { key: 'HR', text: 'HR' },
  { key: 'IT', text: 'IT' },
  { key: 'Admin', text: 'Admin' }
];

export const cancelIcon: IIconProps = { iconName: 'Cancel' };

const EmployeeTaxonomyForm  : React.FC <IEmployeeFormProps>= ({onSaved,selectedEmployee ,onReset,message,isModalOpen,onDismiss,handleAddClick,context})  => {
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const [pickerKey, setPickerKey] = React.useState<number>(0);
    const [formData, setFormData] = React.useState<IEmployee>({
        Title: '',
        JoiningDate: '',
        Department: '',
        Experience: '',
        CountryState:null
    });
  const [isFormLoading, setIsFormLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

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
        ID: selectedEmployee.ID,
        CountryState:selectedEmployee.CountryState
      })
    } else {
      handleResetForm();
    }
    setIsFormLoading(false);
  }, [selectedEmployee]);

  const handleResetForm = () => {
    setFormData({
      Title: '',
      JoiningDate: '',
      Department: '',
      Experience: '',
      CountryState:null
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
 
const handleSubmit =  async () => {
      setIsSubmitting(true);
    try {
      if (!formData.Title || !formData.JoiningDate || !formData.Department || !formData.Experience || !formData.CountryState) {
        setValidationError('Failed : Please fill in all fields.');
          setIsSubmitting(false);
       return;
      }
      setValidationError(null); // Clear any previous validation error
      await onSaved(formData);
      handleResetForm();
    
    } catch (err) {
      console.error("Error in try block:", err);
    } 
    finally{
       setIsSubmitting(false);
    }
  };  
const handleModalDismiss = () => {
  setValidationError(null); // Clear the local validation message
   setFormData({
      Title: '',
      JoiningDate: '',
      Department: '',
      Experience: '',     
      CountryState:null
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

const onCountryPickerChange = (terms: IPickerTerms) => {
  if (!terms || terms.length === 0) {
    setFormData(prev => ({
      ...prev,
      CountryState: null
    }));
   
    return;
  }
  const selectedTerm = terms[0];
  if (!(selectedTerm.path.includes(";"))|| selectedTerm.path.startsWith(";")) {
    alert(`Parent terms like ${selectedTerm.name} cannot be selected.`);
    setFormData((prev) => ({ ...prev, CountryState: null }));
    setPickerKey(prev => prev + 1); 
    return;
  }
  //  setSelectedTerms(terms);
    setFormData(prev => ({
      ...prev,
      CountryState: {Label:selectedTerm.name,
      TermID: selectedTerm.key,
      WssId: -1,
      }
    }));
   
  console.log("Valid child term selected:", selectedTerm.name);
};

const handleOnPanelSelectionChange = (prevValue: IPickerTerms, newValue: IPickerTerms) => {
 if (!(newValue[0].path.includes(";"))) {
    alert(`Parent terms like ${newValue[0].name} cannot be selected.`);
    setFormData((prev) => ({ ...prev, CountryState: null }));
    setPickerKey(prev => prev + 1); 
    return;
  }
  
};
const titleId = useId('modal-title');
if (isFormLoading) {
  return <Spinner size={SpinnerSize.large} label="Loading profile..." />;
}
  return (
        <div>
            <DefaultButton onClick={handleAddClick} text="Add Employee" />
        
            <Modal
            titleAriaId={titleId}
            isOpen={isModalOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName={cssStyles.container}
            // className={styles.container}
      
            >
              <div className={cssStyles.header}>
              <h2 className={cssStyles.heading} id={titleId}>
              {selectedEmployee ? 'Update Employee' : 'Add Employee'}
              </h2>
              <IconButton
                  className={cssStyles.iconButton}
                  iconProps={cancelIcon}
                  ariaLabel="Close popup modal"
                  onClick={handleModalDismiss} 

              />
              </div>
                  <div className={cssStyles.body}>
                  <Stack tokens={ { childrenGap: 20 }} className={cssStyles.stackRoot}>
                                  <Stack horizontal tokens={ { childrenGap: 20 }}className={cssStyles.stackRoot}>
                                      <Stack className={cssStyles.columnRoot }>
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
                                      <Stack className={cssStyles.columnRoot }>
                                          <Dropdown
                                            placeholder="Select an Department"
                                            label="Department"
                                            options={options}
                                            className={cssStyles.dropdown}
                                            onChange={handleDropdownChange}
                                            selectedKey={formData.Department ?? null}
                                          />
                                          <TextField label="Experience" 
                                              onChange={handleInputChange('Experience')} 
                                              value={formData.Experience} type='number'
                                          />
                                      </Stack>
                                      </Stack>
                  


                                  <Stack horizontal   horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
                                    <TaxonomyPicker allowMultipleSelections={false}
                                     key={pickerKey} 
                                      termsetNameOrID="fbfa2501-11c0-4efc-852a-602f5493a311"
                                      panelTitle="Select Country/ State"
                                      label="Country/State"
                                      context={context as any}
                                      onChange={onCountryPickerChange}
                                      isTermSetSelectable={false}
                                      initialValues={
                                        formData.CountryState?[{
                                          key:formData.CountryState.TermID,
                                          name: formData.CountryState.Label,
                                          path:"",
                                          termSet:""
                                        }]:[]
                                      }
                                      
                                      onPanelSelectionChange={handleOnPanelSelectionChange}
                                       />       
                                </Stack> 

                                 {(validationError || message) && (
                                    <div style={{ color: (validationError || message)?.startsWith('Failed') ? 'red' : 'green' }}>
                                        {validationError || message}
                                    </div>
                                  )}

                                    {isSubmitting && (
                                      <Stack horizontalAlign="center" style={{ marginTop: 10 }}>
                                        <Spinner label="Saving..." size={SpinnerSize.large} />
                                      </Stack>
                                    )}
                                      <Stack horizontal   horizontalAlign="end" tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
                                      <DefaultButton text="Reset" onClick={handleResetForm} disabled={selectedEmployee||isSubmitting?true:false} />
                                      <PrimaryButton text={selectedEmployee ? 'Update' : 'Add'} onClick={handleSubmit} disabled={isSubmitting}  />
                                  </Stack> 
                                  </Stack>
                  </div>
          <div className={cssStyles.header}></div>    
        </Modal>
    </div>
  );
};

export default EmployeeTaxonomyForm;
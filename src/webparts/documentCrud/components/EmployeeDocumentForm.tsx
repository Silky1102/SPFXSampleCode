import * as React from 'react';
import {
  Modal,  Dropdown, IDropdownOption,
  Stack, DefaultButton, PrimaryButton, IconButton,MessageBar
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { IDocument } from '../types/IDocument';
import { contentStyles, stackTokens, stackStyles, columnProps,iconButtonStyles } from '../styles/ModelStyles';

interface IFormProps {
  selectedDoc: IDocument | null;
  isModalOpen: boolean;
  onDismiss: () => void;
  onReset: () => void;
  onSaved: (file: File, department: string, itemId?: number) => void;
  message: string | null;
}
const options: IDropdownOption[] = [
  { key: 'HR', text: 'HR' },
  { key: 'IT', text: 'IT' },
  { key: 'Admin', text: 'Admin' }
];

const EmployeeDocumentForm  : React.FC <IFormProps>  = ({ selectedDoc, isModalOpen, onDismiss, onSaved, onReset, message })  => {
 
 const [department, setDepartment] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedDoc) {
      setDepartment(selectedDoc.Department);
    } else {
      handleResetForm();
    }
  }, [selectedDoc]);

  const handleResetForm = () => {
    setDepartment('');
    setFile(null);
    onReset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

const handleModalDismiss = () => {
  setValidationError(null); 
  setFile(null);
  onDismiss(); 
};

  const handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setDepartment(option?.key as string)
    }
  };

  const handleSubmit = () => {
    if (!file && !selectedDoc) {
      setValidationError("Failed : Please choose a file.");
      return;
    }
    if (!department) {
      setValidationError("Failed : Please select a department.");
      return;
    }

    setValidationError(null);
    onSaved(file!, department, selectedDoc?.ID);
    handleResetForm();
  };

  const titleId = useId('doc-modal-title');

  return (
        <div>
    <Modal
      titleAriaId={titleId}
      isOpen={isModalOpen}
      onDismiss={onDismiss}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
 
      <div className={contentStyles.header}>
        <h2 className={contentStyles.heading} id={titleId}>
                    {selectedDoc ? 'Update Document' : 'Add Document'}
                    </h2>
     
        <IconButton   styles={iconButtonStyles} iconProps={{ iconName: 'Cancel' }} onClick={handleModalDismiss} />
      </div>

      <div className={contentStyles.body}>
        <Stack tokens={stackTokens} styles={stackStyles}>
          <Stack horizontal tokens={stackTokens}>
            <Stack {...columnProps}>
              <input type="file" id="FileInput" onChange={handleFileChange} disabled={!!selectedDoc} />
              <Dropdown
                label="Department"
                selectedKey={department}
                options={options}
                 onChange={handleDropdownChange}
                //onChange={(e, option) => setDepartment(option?.key as string)}
              />
            </Stack>
          </Stack>

          {(validationError || message) && (
            <div style={{ color: (validationError || message)?.startsWith('Failed') ? 'red' : 'green' }}>
              {validationError || message}
            </div>
          )}


          <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="end">
            <DefaultButton text="Reset" onClick={handleResetForm} />
            <PrimaryButton text={selectedDoc ? "Update" : "Upload"} onClick={handleSubmit} />
          </Stack>
          {selectedDoc?
           <MessageBar>
           Document file cannot be replaced directly. To update the file, please delete the existing item and upload a new one.
          </MessageBar>:null}
          
        </Stack>
      </div>
    </Modal>
    </div>
  );
};

export default EmployeeDocumentForm;
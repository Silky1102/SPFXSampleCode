import * as React from 'react';
import {
  Modal,
  Stack, DefaultButton, PrimaryButton, IconButton,
} from '@fluentui/react';
import PeoplePickerComponent from './PeoplePickerComponent';
import { useId } from '@fluentui/react-hooks';
import { IDocument } from '../types/IDocument';
import { contentStyles, stackTokens, stackStyles, columnProps, iconButtonStyles } from '../styles/ModelStyles';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import { AadHttpClient } from '@microsoft/sp-http';
import { TextField } from '@fluentui/react/lib/TextField';
import { sendEmailToUsers } from '../services/GraphService'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import styles from './DocumentCrud.module.scss';

interface IFormProps {
  selectedDoc: IDocument | null;
  isApprovalModalOpen: boolean;
  onDismiss: () => void;
  onEmailSend: () => void;
  context: any;
  response: (message: string) => void; // Optional response prop for handling email send result
}


const DocumentApprovalEmail: React.FC<IFormProps> = ({ context, selectedDoc, isApprovalModalOpen, onDismiss, onEmailSend, response }) => {

  const [selectedUsers, setSelectedUsers] = React.useState<IPersonaProps[]>([]);
  const [aadClient, setAadClient] = React.useState<AadHttpClient | null>(null);
  const [Subject, setSubject] = React.useState<string>('');
  const [Body, setBody] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const initAadClient = async () => {
      const client = await context.aadHttpClientFactory.getClient('https://graph.microsoft.com');
      setAadClient(client);
    };
    initAadClient();
  }, []);

  const handleModalDismiss = () => {
    setSelectedUsers([]);
    setBody('');
    setSubject('');
    setValidationError(null);
    onDismiss();
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: string
  ) => {
    setter(value || '');
  };


  const handleSendEmail = async () => {
    if (!aadClient) {
      setValidationError('AadHttpClient is not initialized.');
      return;
    }
    if (selectedUsers.length === 0) {
      setValidationError('Please select at least one user.');
      return;
    }

    if (!Subject.trim()) {
      setValidationError('Please enter a subject.');
      return;
    }

    if (!Body.trim()) {
      setValidationError('Please enter the email body.');
      return;
    }

    if (!selectedDoc) {
      setValidationError('No document selected to attach.');
      return;
    }
    setIsLoading(true);
    setValidationError(null);
    try {
      const result = await sendEmailToUsers(aadClient, selectedUsers, Subject, Body, selectedDoc);
      console.log(result);
      if (result) {
        response(result); // Call the response function if provided
      }
    }
    catch (err) {
      console.error("Send failed:", err);
      setIsLoading(false);
    }
    finally {
      setBody('');
      setSubject('');
      onEmailSend();
      setSelectedUsers([]);
      setIsLoading(false);
    }
  };

  const titleId = useId('doc-modal-title');

  return (
    <div>
      <Modal
        titleAriaId={titleId}
        isOpen={isApprovalModalOpen}
        onDismiss={onDismiss}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div style={{ position: 'relative' }}> {/* 👈 Add relative container */}
          {/* Loading Overlay */}
          {isLoading && (
            <div className={styles.overlay}>
              <Spinner size={SpinnerSize.large} label="Sending email..." />
            </div>
          )}
          <div className={contentStyles.header}>
            <h2 className={contentStyles.heading} id={titleId}>
              Document Approval Email
            </h2>

            <IconButton styles={iconButtonStyles} iconProps={{ iconName: 'Cancel' }} onClick={handleModalDismiss} />
          </div>

          <div className={contentStyles.body}>
            <Stack tokens={stackTokens} styles={stackStyles}>
              <Stack horizontal tokens={stackTokens}>
                <Stack {...columnProps}>
                  {aadClient && (
                    <PeoplePickerComponent
                      aadClient={aadClient}
                      onSelectionChanged={setSelectedUsers}
                    />
                  )}
                  <TextField label="Subject"
                    onChange={handleInputChange(setSubject)}
                    value={Subject}
                  />
                  <TextField label="Body" multiline rows={5} onChange={handleInputChange(setBody)} />
                {validationError && (
                  <div style={{ color: 'red', paddingTop: 8 }}>
                    {validationError}
                  </div>
                )}

                <Stack horizontal tokens={{ childrenGap: 20 }} horizontalAlign="end" className={styles.buttonAllignment}>
                  <DefaultButton text="Cancel" onClick={handleModalDismiss} />
                  <PrimaryButton text="Send Email" onClick={handleSendEmail} />
                </Stack>  
                </Stack>

              </Stack>
            </Stack>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentApprovalEmail;
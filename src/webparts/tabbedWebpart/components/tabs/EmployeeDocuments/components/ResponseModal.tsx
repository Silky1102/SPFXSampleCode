import * as React from 'react';
import {
  Modal,  
  IconButton,
} from '@fluentui/react';

import { useId } from '@fluentui/react-hooks';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { contentStyles, iconButtonStyles } from '../styles/ModelStyles';
import styles from './DocumentCrud.module.scss';


interface IFormProps {
  onDismiss: () => void;
  response: string | null; // Optional response prop for handling email send result
  isResponseModalOpen: boolean;
}


const ResponseModal  : React.FC <IFormProps>  = ({isResponseModalOpen, response, onDismiss})  => {
 
    const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleModalDismiss = () => {
    onDismiss(); 
  };
  
  React.useEffect(() => {
    if (isResponseModalOpen) {
        if(response){
          if (response.startsWith('Failed')) {
             setValidationError(`Email delivery failed: Microsoft Graph accepted the request, but the recipient's server rejected the email. Reason: ${response}`);
          }
          else
          {
             setValidationError(response ? response : 'No response provided');
          }
        } 
    
    }
  }, [isResponseModalOpen, response]);

  const titleId = useId('doc-modal-title');
  return (
        <div>
    <Modal
      titleAriaId={titleId}
      isOpen={isResponseModalOpen}
      onDismiss={onDismiss}
      isBlocking={false}
      containerClassName={styles.container}
    >    
      <div className={contentStyles.header}>
            <h2 className={contentStyles.heading} id={titleId}>
                Response
            </h2>
         
            <IconButton styles={iconButtonStyles} iconProps={{ iconName: 'Cancel' }} onClick={handleModalDismiss} />
          </div>
    
          {validationError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              truncated={true}
              styles={{ root: { marginBottom: 12 } }}
            >
              {validationError}
            </MessageBar>
          )}

          
    </Modal>
    </div>
  );
};

export default ResponseModal;
import * as React from 'react';
import { Panel ,PanelType} from '@fluentui/react/lib/Panel';
import { DefaultButton } from '@fluentui/react/lib/Button';
import {IUserProfileWebpartProps} from '../components/IUserProfileWebpartProps'
import UserProfile from './UserProfile';
import { useBoolean } from '@fluentui/react-hooks';


const UserProfileWebpart: React.FC<IUserProfileWebpartProps>= ({context}) =>{
  
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
 
  return(
    <div>
        <DefaultButton text="Show User Profile" onClick={openPanel} />
      
        <Panel
          isLightDismiss
          type={PanelType.custom}
          customWidth='500px'
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          headerText="User Profile"
        >
        <UserProfile
          context={context}
        />

    </Panel>
    </div>
  );
}

export default UserProfileWebpart;


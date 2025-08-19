import * as React from 'react';
import {  DocumentCard,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage, } from '@fluentui/react';
import {MSGraphClientV3} from '@microsoft/sp-http';
import {Text,Stack ,Icon} from "@fluentui/react";
//import {cardContentStyle,columnProps,stackTokens,textSmallStyle} from '../styles/ModelStyles'
import styles from './UserProfileWebpart.module.scss'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import {getUserProfile,getUserPhoto} from '../services/GraphService'
interface IUserProfileProps {
  context: any;
 
}
const UserProfile: React.FC<IUserProfileProps>= ({context}) =>{
    const [user,setUser]= React.useState<any>(null);
    const [photoURL,setPhotoURL]=React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(()=>{
  (async () => {
       const msGraphClient: MSGraphClientV3 = await context.msGraphClientFactory.getClient("3");

      const me = await getUserProfile(msGraphClient);
      setUser(me);

      const photo = await getUserPhoto(msGraphClient);
      if (photo) {
        setPhotoURL(photo);
      }

    setIsLoading(false);
    })();
  }, [context]);

if (isLoading) {
    return <Spinner size={SpinnerSize.large} label="Loading profile..." />;
  }
  return (
    <div>
     <DocumentCard
      className={styles.documentCard}
        >
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <DocumentCardImage
          height={80}
          imageFit={1} // cover
          imageSrc={photoURL}
          className={styles.documentCardImage}
        /><DocumentCardDetails>
        {/* Main Details */}
          <Stack  className={styles.columnRoot}>
            <DocumentCardTitle title={user?.displayName || "No name"} className={styles.documentTitle}/>
            <Text variant="medium">{user?.jobTitle || "No email"} </Text>
          </Stack>
        </DocumentCardDetails>
      </Stack>

      <DocumentCardDetails>
        {/* Separator */}
        <div
           className={styles.separator}
        />
        <Stack
              horizontal
              wrap
               className={styles.stackRoot}
            >
              {/* Location */}
              {user?.officeLocation && (
                <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                  <Icon iconName="POI" />
                  <Stack>
                    <Text variant="small" className={styles.textSmall}>
                      Location
                    </Text>
                    <Text>{user?.officeLocation}</Text>
                  </Stack>
                </Stack>
              )}

              {/* Mobile */}
              {user?.businessPhones?.[0] && (
                <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                  <Icon iconName="CellPhone" />
                  <Stack>
                    <Text variant="small"  className={styles.textSmall}>
                      Mobile
                    </Text>
                    <Text>{user?.businessPhones?.[0]}</Text>
                  </Stack>
                </Stack>
              )}

              {/* Job Title */}
              {user?.jobTitle && (
                <Stack horizontal tokens={{ childrenGap: 6}} verticalAlign="center">
                  <Icon iconName="Contact" />
                  <Stack>
                    <Text variant="small" className={styles.textSmall}>
                      Job title
                    </Text>
                    <Text>{user?.jobTitle}</Text>
                  </Stack>
                </Stack>
              )}
                {/* Email */}
              {user?.userPrincipalName && (
                <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
                  <Icon iconName="Mail" />
                  <Stack>
                    <Text variant="small"   className={styles.textSmall}>
                      Email
                    </Text>
                    <Text>{user?.userPrincipalName}</Text>
                  </Stack>
                </Stack>
              )}
            </Stack>
      </DocumentCardDetails>
     </DocumentCard>
    </div>
  );
}

export default UserProfile;
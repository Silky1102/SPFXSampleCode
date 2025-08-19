import * as React from 'react';
import styles from './TabbedWebpart.module.scss';
import type { ITabbedWebpartProps } from './ITabbedWebpartProps';
import { Pivot, PivotItem } from '@fluentui/react';
import GeneralInfo from './tabs/General/GeneralInfo';
import EmployeeModalInput from './tabs/EmployeeList/components/EmployeeModalInput';
import  DocumentCrud from './tabs/EmployeeDocuments/components/DocumentCrud';
// import { IEmployeeModalInputProps } from '../tabbedWebpart/components/IEmployeeModalInputProps';

// export default class TabbedWebpart extends React.Component<ITabbedWebpartProps> {
//   public render(): React.ReactElement<ITabbedWebpartProps> {
//     const {
//       description,
//       isDarkTheme,
//       environmentMessage,
//       hasTeamsContext,
//       userDisplayName
//     } = this.props;

//     return (
//       <section className={`${styles.tabbedWebpart} ${hasTeamsContext ? styles.teams : ''}`}>
//         <div className={styles.welcome}>
//           <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
//           <h2>Well done, {escape(userDisplayName)}!</h2>
//           <div>{environmentMessage}</div>
//           <div>Web part property value: <strong>{escape(description)}</strong></div>
//         </div>
//         <div>
//           <h3>Welcome to SharePoint Framework!</h3>
//           <p>
//             The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
//           </p>
//           <h4>Learn more about SPFx development:</h4>
//           <ul className={styles.links}>
//             <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
//             <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
//             <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
//           </ul>
//         </div>
//       </section>
//     );
//   }
// }


const TabbedWebpart: React.FC<ITabbedWebpartProps> = (props) => {
  return (
    <div className={styles.tabsPoc}>
      <Pivot aria-label="Basic Tabs Example">
        <PivotItem headerText="General Info" >
          <div className={styles.tabContent}>
              <GeneralInfo />
          </div>
         
        </PivotItem>
        <PivotItem headerText="Employee List">
          <div className={styles.tabContent}>
            <EmployeeModalInput context={props.context} listName={props.listName} />
          </div>
        </PivotItem>
        <PivotItem headerText="Employee Documents">
          <div className={styles.tabContent}>
            <DocumentCrud context={props.context} libraryName={props.libraryName} />
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default TabbedWebpart;
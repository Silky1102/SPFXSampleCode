
import { SPHttpClient } from '@microsoft/sp-http';

export interface IEmployeeInfoProps {
  listName: string;
  siteUrl: string;
  spHttpClient: SPHttpClient;
}

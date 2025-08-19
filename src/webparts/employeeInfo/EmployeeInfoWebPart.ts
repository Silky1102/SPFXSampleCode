import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import * as strings from 'EmployeeInfoWebPartStrings';
import EmployeeInfo from './components/EmployeeInfo';
import { IEmployeeInfoProps } from './components/IEmployeeInfoProps';
import { SPHttpClient } from '@microsoft/sp-http';

export interface IEmployeeInfoWebPartProps {
  listName: string;
  siteUrl: string;
  spHttpClient: SPHttpClient;
}

export default class EmployeeInfoWebPart extends BaseClientSideWebPart<IEmployeeInfoWebPartProps> {



  public render(): void {
    const element: React.ReactElement<IEmployeeInfoProps> = React.createElement(
      EmployeeInfo,
      {
        listName: this.properties.listName,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.resolve();
  }



 protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private validateListName = (value: string): string | Promise<string> => {
    const expectedList = "EmployeeDetails"; 
    if (!value || value.trim().toLowerCase() !== expectedList.toLowerCase()) {
      return `This web part requires the list name to be "${expectedList}".`;
    }

    return ""; // No error
  };
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
          
                 PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel,
                  onGetErrorMessage: this.validateListName,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

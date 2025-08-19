import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeModalInputWebPartStrings';
import EmployeeModalInput from './components/EmployeeModalInput';
import { IEmployeeModalInputProps } from './components/IEmployeeModalInputProps';
import { getSP } from './services/pnpjsConfig';


export interface IEmployeeModalInputWebPartProps {
   listName: string;

}

export default class EmployeeModalInputWebPart extends BaseClientSideWebPart<IEmployeeModalInputWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IEmployeeModalInputProps> = React.createElement(
      EmployeeModalInput,
      {
        listName: this.properties.listName,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

 private validateListName = (value: string): string | Promise<string> => {
    const expectedList = "EmployeeDetails"; 
    if (!value || value.trim().toLowerCase() !== expectedList.toLowerCase()) {
      return `This web part requires the list name to be "${expectedList}".`;
    }

    return ""; // No error
  };

  public async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context); // initialize the SP object
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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

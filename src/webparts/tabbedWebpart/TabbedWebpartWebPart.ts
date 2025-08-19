import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TabbedWebpartWebPartStrings';
import TabbedWebpart from './components/TabbedWebpart';
import { ITabbedWebpartProps } from './components/ITabbedWebpartProps';


import { getSP } from '../tabbedWebpart/services/pnpjsConfig';

export interface ITabbedWebpartWebPartProps {
 listName: string;
 libraryName:string
}

export default class TabbedWebpartWebPart extends BaseClientSideWebPart<ITabbedWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITabbedWebpartProps> = React.createElement(
      TabbedWebpart,
      {
         listName: this.properties.listName,
         libraryName: this.properties.libraryName,
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
  private validateLibraryName = (value: string): string | Promise<string> => {
      const expectedLibrary = "EmployeeDocuments"; 
      if (!value || value.trim().toLowerCase() !== expectedLibrary.toLowerCase()) {
        return `This web part requires the library name to be "${expectedLibrary}".`;
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
                }),
                PropertyPaneTextField('libraryName', {
                  label: strings.LibNameFieldLabel,
                  onGetErrorMessage: this.validateLibraryName,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}

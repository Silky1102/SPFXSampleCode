import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { getSP } from './services/pnpjsConfig';

import * as strings from 'DocumentLibraryWebpartWebPartStrings';
import DocumentLibraryWebpart from './components/DocumentLibraryWebpart';
import { IDocumentLibraryWebpartProps } from './components/IDocumentLibraryWebpartProps';

export interface IDocumentLibraryWebpartWebPartProps {
 libraryName: string;
     context: any; 
}

export default class DocumentLibraryWebpartWebPart extends BaseClientSideWebPart<IDocumentLibraryWebpartWebPartProps> {



  public render(): void {
    const element: React.ReactElement<IDocumentLibraryWebpartProps> = React.createElement(
      DocumentLibraryWebpart,
      {
        libraryName: this.properties.libraryName,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context); // initialize the SP object
  }

private validateLibName = (value: string): string | Promise<string> => {
    const expectedList = "EmployeeDocumentsLibrary"; 
    if (!value || value.trim().toLowerCase() !== expectedList.toLowerCase()) {
      return `This web part requires the list name to be "${expectedList}".`;
    }
    return ""; // No error
  };



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
                PropertyPaneTextField('libraryName', {
                  label: strings.LibraryNameFieldLabel,
                  onGetErrorMessage: this.validateLibName,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

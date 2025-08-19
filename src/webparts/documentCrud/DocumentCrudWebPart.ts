import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import * as strings from 'DocumentCrudWebPartStrings';
import DocumentCrud from './components/DocumentCrud';
import { IDocumentCrudProps } from './components/IDocumentCrudProps';
import { getSP } from './services/pnpjsConfig';

export interface IDocumentCrudWebPartProps {
 libraryName: string;
}

export default class DocumentCrudWebPart extends BaseClientSideWebPart<IDocumentCrudWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDocumentCrudProps> = React.createElement(
      DocumentCrud,
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
    const expectedList = "EmployeeDocuments"; 
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

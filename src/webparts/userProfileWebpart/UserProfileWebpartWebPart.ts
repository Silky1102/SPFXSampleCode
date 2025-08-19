import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'UserProfileWebpartWebPartStrings';
import UserProfileWebpart from './components/UserProfileWebpart';
import { IUserProfileWebpartProps } from './components/IUserProfileWebpartProps';

export interface IUserProfileWebpartWebPartProps {
  // description: string;
  context:string
}

export default class UserProfileWebpartWebPart extends BaseClientSideWebPart<IUserProfileWebpartWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IUserProfileWebpartProps> = React.createElement(
      UserProfileWebpart,
      {
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

 protected async onInit(): Promise<void> {
  await super.onInit();
  // Your initialization logic here
  console.log("Web part initialized");

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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

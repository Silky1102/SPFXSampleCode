import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,  PlaceholderContent,
 PlaceholderName
} from '@microsoft/sp-application-base';

import * as React from 'react';
import * as ReactDom from "react-dom";

import BottomComponent from './components/BottomComponent';
const LOG_SOURCE: string = 'PortalBannerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPortalBannerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  //testMessage: string;
   footerText?: string;
  contactUrl?: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PortalBannerApplicationCustomizer
  extends BaseApplicationCustomizer<IPortalBannerApplicationCustomizerProperties> {
 private _bottomPlaceHolder: PlaceholderContent | undefined;


 
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized BasicApplicationCustomizer");
 	  const footerText = this.properties.footerText || "Copyright 2001-2025 Accenture. All rights reserved. Accenture Confidential. For internal use only.";
    const contactUrl = this.properties.contactUrl || "/sites/Assignment/SitePages/Contact-Us.aspx";

	// Handling the bottom placeholder
    this._renderBottomPlaceHolder(footerText,contactUrl);
    return Promise.resolve();
  }

  private _renderBottomPlaceHolder(footerText:string,contactUrl:string): void {
  
		// check if the application customizer has already been rendered
		if (!this._bottomPlaceHolder) {
			this._bottomPlaceHolder =
				this.context.placeholderProvider.tryCreateContent(
					PlaceholderName.Bottom,
					{ onDispose: this._handleDispose }
				);
		}
		// if the bottom placeholder is not available, there is no place in the UI
		// for the app customizer to render, so quit.
		if (!this._bottomPlaceHolder) {
			return;
		}

		if (this._bottomPlaceHolder.domElement) {
			// create a DOM element in the bottom placeholder for the application customizer to render
			const element = React.createElement(BottomComponent, { footerText, contactUrl });
			// render the UI using a React component
			ReactDom.render(element, this._bottomPlaceHolder.domElement);
      
		}
	}
private _handleDispose(): void {
  console.log('[OutageBannerApplicationCustomizer] Disposed custom top placeholder.');
}
}

import * as React from "react";
import { Link } from '@fluentui/react'

export interface IBottomComponentProps { 
 footerText?: string;
 contactUrl?: string;
}

const BottomComponent: React.FC<IBottomComponentProps> = ({footerText,contactUrl}) => {
 const copyright = footerText || '© Copyright 2001-2025 Accenture. All rights reserved. Accenture Confidential. For internal use only. Ltd.';
  const link = contactUrl || '/sites/Assignment/SitePages/Contact-Us.aspx';
    return(
         <div style={{
            backgroundColor: '#f3f2f1',
            padding: '12px',
            fontSize: '14px',
            color: '#333',
            textAlign: 'center',
            borderTop: '1px solid #ccc',
            position: 'relative',
            zIndex: 9999
    }}>
      {copyright} |{" "}
      <Link href={link} target="_blank" style={{ color: '#0078d4', textDecoration: 'none' }}>
        Contact Us
      </Link>
    </div>
    )

}    

export default BottomComponent;




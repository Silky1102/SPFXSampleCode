// ModalStyles.ts
import { getTheme, mergeStyleSets, FontWeights } from '@fluentui/react';
import {  IButtonStyles } from '@fluentui/react/lib/Button';
import { IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { IStackStyles, IStackProps, IStackTokens } from '@fluentui/react';
import { IIconProps } from '@fluentui/react/lib/Icon';

export const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };
 export const stackTokens = { childrenGap: 20 };
  export const stackStyles: Partial<IStackStyles> = {
    //  root: { width: 400 }
    root: {
        width: '100%',
        maxWidth: '500px',     // or whatever looks best
        boxSizing: 'border-box',
      },
    
    
    };
  export const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 400 } },
  };

 export  const stackTokensButtons: IStackTokens = { childrenGap: 10 };
export const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const theme = getTheme();
export const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

export const fileStyles = mergeStyleSets({
   fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px',
  },
   fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
})
export const contentStyles = mergeStyleSets({
 container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    width: '100%', // ✅ use full width
    maxWidth: '600px', // ✅ safe max width
    minHeight: '300px',  
    padding: '20px',
    boxSizing: 'border-box',
      overflowX: 'hidden',  
  },header: [
    
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
  body: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '0 24px 24px 24px',
  },
  
});


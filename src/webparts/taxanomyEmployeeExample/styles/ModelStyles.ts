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
  export const stackStyles: Partial<IStackStyles> = { root: { width: 500 } };
  export const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
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
export const contentStyles = mergeStyleSets({
 container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    maxWidth: '700px',
    minHeight: '300px',          // ✅ ensures enough height
    padding: '20px',
    boxSizing: 'border-box',
  },header: [
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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

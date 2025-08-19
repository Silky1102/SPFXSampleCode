import { INavLink } from '@fluentui/react/lib/Nav';


interface IFolderItemProps{
    Name:string;
    ServerRelativeUrl:string
    
}

const FolderItem = (folder: IFolderItemProps,onExpand:(url:string)=>void): INavLink => ({
    key: folder.ServerRelativeUrl,
    name:folder.Name,
    url:'',
    isExpanded: false,
     links: [
    {
      key: `${folder.ServerRelativeUrl}-placeholder`,
      name: '',
      url: '',
    },
  ],
    onClick: () => onExpand(folder.ServerRelativeUrl),
    expandAriaLabel: 'Expand folder',
    collapseAriaLabel: 'Collapse folder'
}
);

export default FolderItem;
    
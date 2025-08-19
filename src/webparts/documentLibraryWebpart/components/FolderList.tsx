import * as React from 'react';
import {IFolder} from '../types/IFolder';
import {Icon} from '@fluentui/react/lib/Icon';
import {DetailsList, DetailsListLayoutMode, SelectionMode,IColumn} from '@fluentui/react/lib/DetailsList';

interface IFolderListProps {  
    folders: IFolder[];
    onFolderClick?: (folder: IFolder) => void;
   
}



const FolderList: React.FC<IFolderListProps> = ({ folders,onFolderClick }) => {

    const columns: IColumn[] = [
      {
        key: 'FileType',
        name: 'FileType',
        fieldName: 'FileType',
        isIconOnly: true,
        iconName: 'Page',
        minWidth: 16,
        maxWidth: 16,
        onRender: (item: IFolder) => (
            <div style ={{cursor: 'pointer'}}   onClick={() => onFolderClick && onFolderClick(item)}>
                    <Icon iconName='FabricFolderFill'  styles={{ root: { marginRight: 6 } }} />
            </div>
        ),
      }
      ,  {
        key: 'name',
        name: 'Name',
        fieldName: 'name',
        minWidth: 80,
        maxWidth: 100,
        onRender: (item: IFolder) => (
            <div style ={{cursor: 'pointer'}}   onClick={() => onFolderClick && onFolderClick(item)}>
                {item.Name}
            </div>
        ),
      },
      {
        key: 'Date Modified',
        name: 'Date Modified',
        fieldName: 'ModifiedDate',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
      
        data: 'number',
        onRender: (item: IFolder) => {
          return <span>{item.ModifiedDate}</span>;
        },
        isPadded: true,
      }
    ];

    const visibleFolders= folders.filter(folder => folder.Name!== 'Forms' && folder.Name !== 'Site Assets');
    return(
        // <>
        // <ul>
        //     {folders.map(folder=>(
        //         <li key={folder.ServerRelativeUrl} onClick={()=> onFolderClick && onFolderClick(folder)} style={{cursor: 'pointer'}}>
        //             <Icon iconName='Folder'/>
        //             {folder.Name}
        //             </li>
        //     ))}
        // </ul>
        // </>

          <DetailsList
              items={visibleFolders}
              columns={columns}
              selectionMode={SelectionMode.single}
              compact={true}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
            />
    );
}
export default FolderList;
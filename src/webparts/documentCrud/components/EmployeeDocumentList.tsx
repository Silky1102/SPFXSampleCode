import * as React from 'react';
import {TooltipHost, DetailsList, IColumn, SelectionMode, IconButton,Dialog,DialogFooter,PrimaryButton,DefaultButton,DialogType } from '@fluentui/react';
import { IDocument } from '../types/IDocument';
import { fileStyles} from '../styles/ModelStyles';

interface IProps {
  documents: IDocument[];
  onEdit: (doc: IDocument) => void;
  onDelete: (doc: IDocument) => void;
}


    
const EmployeeDocumentList : React.FC<IProps> = ({ documents, onEdit, onDelete }) => {

  const confirmDelete = () => {
        if (selectedDocument) {
            onDelete(selectedDocument);
        }
        setHideDialog(true);
        setSelectedDocument(null);
    }

    const closeDialog = () => {
        setHideDialog(true);
        setSelectedDocument(null);
    }

    const showDeleteDialog = (item: IDocument) => {
        setHideDialog(false);
        setSelectedDocument(item);
       
    };  
   
    const getFileIconUrl = (fileType: string): string => {
      return `https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/${fileType.toLowerCase()}.svg`;
    };
  const [selectedDocument, setSelectedDocument] = React.useState<IDocument | null>(null);
  const [hideDialog, setHideDialog] = React.useState(true);
  
    const columns: IColumn[] = [
      { key: 'FileType',
        name: 'File Type',
        className: fileStyles.fileIconCell,
        iconClassName: fileStyles.fileIconHeaderIcon,
        iconName: 'Page',
        isIconOnly: true,
        fieldName: 'name',
        minWidth: 16,
        maxWidth: 16,

        onRender: (item: IDocument) => (
          <TooltipHost content={`${item.fileType} file`}>
            <img   src={getFileIconUrl(`${item.fileType}`)} className={fileStyles.fileIconImg} alt={`${item.fileType} file icon`} />
          </TooltipHost>
        ),
      },
    { key: 'FileName', name: 'File Name', fieldName: 'FileName', minWidth: 100, maxWidth: 200 },
    { key: 'Department', name: 'Department', fieldName: 'Department', minWidth: 100, maxWidth: 200 },
    {
      key: 'edit', name: 'Edit', fieldName: 'edit', minWidth: 50, maxWidth: 50,
      onRender: item => <IconButton iconProps={{ iconName: 'Edit' }} onClick={() => onEdit(item)} />
    },
    {
      key: 'delete', name: 'Delete', fieldName: 'delete', minWidth: 50, maxWidth: 50,
      onRender: item => <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => showDeleteDialog(item)} />
    }
  ];

  return (
  <div>
  <DetailsList items={documents} columns={columns} selectionMode={SelectionMode.none} />
    
                <Dialog
                    hidden={hideDialog}
                    onDismiss={closeDialog}
                    dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Confirm Deletion',
                            closeButtonAriaLabel: 'Close',
                            subText: `Are you sure you want to delete ${selectedDocument?.FileName}?`,
                            }}
               
                >
                <DialogFooter>
                    <PrimaryButton onClick={confirmDelete} text="Delete" />
                    <DefaultButton onClick={closeDialog} text="Cancel" />
                </DialogFooter>
                </Dialog>
                </div>
  );

};

export default EmployeeDocumentList;

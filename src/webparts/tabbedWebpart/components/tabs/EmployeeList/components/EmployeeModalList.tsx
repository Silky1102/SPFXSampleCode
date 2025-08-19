import * as React from 'react';
import { DetailsList,   IColumn ,SelectionMode } from '@fluentui/react';
import {  IconButton,Dialog,DialogFooter,PrimaryButton,DefaultButton,DialogType } from '@fluentui/react';
import  { IEmployee } from '../types/IEmployee';



interface IEmployeeModalListProps {
  employees: IEmployee[];
  onEdit: (item: IEmployee) => void;
  onDelete: (item: IEmployee) => void;
  
  }

const EmployeeModalList : React.FC <IEmployeeModalListProps>= ({ employees, onEdit, onDelete }) => {

const [selectedEmployee, setSelectedEmployee] = React.useState<IEmployee | null>(null);
const [hideDialog, setHideDialog] = React.useState(true);

    const columns:IColumn[] = [
        
        { key: 'Title', name: 'Employee Name', fieldName: 'Title', minWidth: 100, maxWidth: 200, isMultiline: false },
        { key: 'JoiningDate', name: 'Joining Date', fieldName: 'JoiningDate', minWidth: 100, maxWidth: 200, isMultiline: false,
             onRender: (item: IEmployee) => {
                const date = new Date(item.JoiningDate);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                });
                },
        },
        { key: 'Department', name: 'Department', fieldName: 'Department', minWidth: 100, maxWidth: 200, isMultiline: false },
        { key: 'Experience', name: 'Experience', fieldName: 'Experience', minWidth: 100, maxWidth: 200, isMultiline: false },       
        {
            key: 'edit',
            name: 'Edit',
            fieldName: 'edit',
            minWidth: 100,
            maxWidth: 100,
            isMultiline: false,
            onRender: (item: IEmployee) => (
                <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title="Edit"
                    ariaLabel="Edit"
                    onClick={() => onEdit(item)}
                />
            ),
        },
{
            key: 'actions',
            name: 'Actions',
            fieldName: 'actions',
            minWidth: 100,
            maxWidth: 100,
            isMultiline: false,
            onRender: (item: IEmployee) => (
                <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title="Delete"
                    ariaLabel="Delete"
                    //onClick={() => onDelete(item)}
                    onClick={() => showDeleteDialog(item)}
                />
            ),
        },
    ];


    const confirmDelete = () => {
        if (selectedEmployee) {
            onDelete(selectedEmployee);
        }
        setHideDialog(true);
        setSelectedEmployee(null);
    }

    const closeDialog = () => {
        setHideDialog(true);
        setSelectedEmployee(null);
    }

    const showDeleteDialog = (item: IEmployee) => {
        setHideDialog(false);
        setSelectedEmployee(item);
       
    };  


    return (
               <div>
            <h1>Employee Details</h1>
             <DetailsList items={employees} compact={true} columns={columns} selectionMode={SelectionMode.single}/>

            <Dialog
                hidden={hideDialog}
                onDismiss={closeDialog}
                dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Confirm Deletion',
                        closeButtonAriaLabel: 'Close',
                        subText: `Are you sure you want to delete ${selectedEmployee?.Title}?`,
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

export default EmployeeModalList;

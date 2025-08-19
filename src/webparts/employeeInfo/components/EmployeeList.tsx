import * as React from 'react';
import { DetailsList,   IColumn ,SelectionMode } from '@fluentui/react';
import {  IconButton } from '@fluentui/react';
import  { IEmployee } from '../types/IEmployee';

interface IEmployeeListProps {
  employees: IEmployee[];
  onEdit: (item: IEmployee) => void;
  onDelete: (item: IEmployee) => void;
  }

const EmployeeList : React.FC <IEmployeeListProps>= ({ employees, onEdit, onDelete }) => {
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
                    onClick={() => onDelete(item)}
                />
            ),
        },
    ];

  
    return (
               <div>
            <h1>Employee Details</h1>
             <DetailsList items={employees} compact={true} columns={columns} selectionMode={SelectionMode.single}/>
        </div>
    );
};

export default EmployeeList;

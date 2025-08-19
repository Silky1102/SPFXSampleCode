import * as React from 'react';
import { DetailsList,   IColumn ,SelectionMode } from '@fluentui/react';
import {  IconButton,Dialog,DialogFooter,PrimaryButton,DefaultButton,DialogType,IDropdownOption,Dropdown,Stack} from '@fluentui/react';
import { IEmployee } from '../types/IEmployee';
import { Separator } from '@fluentui/react/lib/Separator';
import cssStyles from  './TaxanomyEmployeeExample.module.scss';

interface IEmployeeModalListProps {
  employees: IEmployee[];
  onEdit: (item: IEmployee) => void;
  onDelete: (item: IEmployee) => void;
  
  }

const EmployeeTaxonomyList : React.FC <IEmployeeModalListProps>= ({ employees, onEdit, onDelete }) => {

    const [selectedEmployee, setSelectedEmployee] = React.useState<IEmployee | null>(null);
    const [hideDialog, setHideDialog] = React.useState(true);

    const [filteredItems, setFilteredItems] = React.useState<IEmployee[]>([]);
    const [selectedCountry, setSelectedCountry] = React.useState<string | undefined>("All");


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
            key: 'CountryState',
            name: 'Country/State',
             fieldName: 'CountryState',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: IEmployee) => (
            <span>{item.CountryState?.Label || ''}</span>
            )
        },     
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

  React.useEffect(() => {
    const loadData = async () => {
        console.log(selectedCountry);
        if (selectedCountry === "All") {
        setFilteredItems(employees);
        } else {
        setFilteredItems(employees.filter((item) => item.CountryState?.Label=== selectedCountry));
        }
       // setFilteredItems(employees); // default: show all
    };
    loadData();
  }, [employees]);

 const countryOptions: IDropdownOption[] = React.useMemo(() => {
    const uniqueCountries = Array.from(
        new Set(
            employees
            .map((i) => i.CountryState?.Label) // get the country state
            .filter((c): c is string => !!c)//remove null and undefined
        )
        ); 
        const countryList=[{ key: "All", text: "All" }, ...uniqueCountries.map((c) => ({ key: c, text: c }))]; 
        console.log(countryList);
        console.log(employees);
        console.log(selectedCountry)
    return countryList//add values to drpdown
  }, [employees]);

  // ✅ Handle Dropdown Change
  const onCountryChange = (_: any, option?: IDropdownOption) => {
    const selected = option?.key as string;
    setSelectedCountry(selected);

    if (selected === "All") {
      setFilteredItems(employees);
    } else {
      setFilteredItems(employees.filter((item) => item.CountryState?.Label=== selected));
    }
  };


    return (
        <div>
        
            <Separator
           className={cssStyles.mySeparator}
            >
            Employee Details
            </Separator>

            <Stack horizontal horizontalAlign="end" verticalAlign="center" styles={{ root: { marginBottom: 10 } }}>
            <Dropdown
                    placeholder="Select a Country"
                    label="Filter by Country / State"
                    options={countryOptions}
                    selectedKey={selectedCountry}
                    onChange={onCountryChange}
                    styles={{ dropdown: { width: 200, marginBottom: 10 } }}
                />
            </Stack>
            <DetailsList items={filteredItems} compact={true} columns={columns} selectionMode={SelectionMode.single}/>
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

export default EmployeeTaxonomyList;

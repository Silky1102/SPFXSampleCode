import * as React from 'react';
import  EmployeeList from './EmployeeList';
import  EmployeeForm from './EmployeeForm';
import { SPHttpClient } from '@microsoft/sp-http';
import { useEffect } from 'react';
import  { IEmployee } from '../types/IEmployee';
import { getEmployees,addEmployee,updateEmployee ,deleteEmployee} from '../services/spservice';

export interface IEmployeeProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

const EmployeeInfo: React.FC<IEmployeeProps> = ({listName,spHttpClient,siteUrl}) => {
const [selectedEmployee, setSelectedEmployee] = React.useState<IEmployee | null>(null);
const [employees, setEmployees] = React.useState<IEmployee[]>([]);
const [message, setMessage] = React.useState<string | null>(null);

useEffect(() => {
    loadEmployees();
  }, []);


const loadEmployees = async () => {
  const data = await getEmployees(listName, spHttpClient, siteUrl);
  setEmployees(data);
};

 
const handleSave = async (employee: IEmployee) => {
    setMessage(null); // Clear previous
    if (employee.ID) {
     let response = await updateEmployee(listName, spHttpClient, siteUrl,employee);;
     setMessage(response);
    } else {
      const response = await addEmployee(listName, spHttpClient, siteUrl,employee);
      setMessage(response);
    }
    await loadEmployees();
    setSelectedEmployee(null);
  };

const handleDelete = async (employee: IEmployee)=> {
  setMessage(null);
  let responseMessage = await deleteEmployee(listName, spHttpClient, siteUrl,employee);;
    if (responseMessage.startsWith('Employee deleted')) {
    const updatedList = employees.filter((emp) => emp.ID !== employee.ID);
    setEmployees(updatedList);
  }

  setMessage(responseMessage);
};

const handleEdit = (employee:IEmployee | null) => {
            if (employee) {
                const emp = employees.find(emp => emp.ID === employee.ID);
                if (emp) {
                    setSelectedEmployee(emp);
                    console.log("Editing employee:", emp);
                }
            }
        };

  return (
    <div>
      <EmployeeForm

        selectedEmployee={selectedEmployee}
        onSaved={handleSave}
        onReset={() => setSelectedEmployee(null)}
        message={message}
      />
      <EmployeeList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EmployeeInfo;   
import * as React from 'react';
import  EmployeeModalForm from './EmployeeModalForm';
import { IEmployee } from '../types/IEmployee';
import { useEffect } from 'react';
import { addEmployee,updateEmployee,getEmployees,deleteEmployee} from '../services/spservice';
import EmployeeModalList from './EmployeeModalList';

export interface IEmployeeModalInputProps {
  listName: string;
  context: any; 
}

const EmployeeModalInput: React.FC<IEmployeeModalInputProps> = ({listName,context}) => {
const [selectedEmployee, setSelectedEmployee] = React.useState<IEmployee | null>(null);
const [message, setMessage] = React.useState<string | null>(null);
const [employees, setEmployees] = React.useState<IEmployee[]>([]);
const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

useEffect(() => {
    loadEmployees();
  }, []);

const loadEmployees = async () => {
  const data = await getEmployees(listName, context);
  setEmployees(data);
};

const handleSave = async (employee: IEmployee) => {
    setMessage(null); 
    if (employee.ID) {
     let response = await updateEmployee(listName, employee, context);
     setMessage(response);
    } else {
      const response = await addEmployee(listName, employee, context);
      setMessage(response);
    }
    await loadEmployees();
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

 const handleDelete = async (employee: IEmployee)=> {
  setMessage(null);
   let responseMessage = await deleteEmployee(listName, employee,context);;
     if (responseMessage.startsWith('Employee deleted')) {
     const updatedList = employees.filter((emp) => emp.ID !== employee.ID);
     setEmployees(updatedList);
   }
  setMessage(responseMessage);
 };
 
const handleEdit = (employee:IEmployee | null) => {
  setMessage(null);
    if (employee) {
        const emp = employees.find(emp => emp.ID === employee.ID);
        if (emp) {
            setSelectedEmployee(emp);
            setIsModalOpen(true);
            console.log("Editing employee:", emp);
        }
    }
};

const handleAddClick = () => {
    setMessage(null);
    setSelectedEmployee(null); 
    setIsModalOpen(true);      
 };

  return (
    <div>
      <EmployeeModalForm 
         selectedEmployee={selectedEmployee}
         onSaved={handleSave}
         onReset={() => setSelectedEmployee(null)}
         message={message}
         isModalOpen={isModalOpen}
         onDismiss={() => setIsModalOpen(false)}
         handleAddClick={handleAddClick}
       />
       <EmployeeModalList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
       
      />
    </div>
  );
};

export default EmployeeModalInput;   
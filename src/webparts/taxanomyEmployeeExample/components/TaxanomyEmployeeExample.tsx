import * as React from 'react';
import  EmployeeTaxonomyForm from './EmployeeTaxonomyForm';
import { IEmployee } from '../types/IEmployee';
import { useEffect } from 'react';
import { addEmployee,updateEmployee,getEmployees,deleteEmployee} from '../services/spservice';
import EmployeeTaxonomyList from './EmployeeTaxonomyList';



export interface IEmployeeModalInputProps {
  listName: string;
    context: any; 
}

const TaxanomyEmployeeExample: React.FC<IEmployeeModalInputProps> = ({listName,context}) => {
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

  const response = employee.ID
    ? await updateEmployee(listName, employee, context)
    : await addEmployee(listName, employee, context);

  setMessage(response.message);

  if (response.success) {
    await loadEmployees();
    setSelectedEmployee(null);
    setIsModalOpen(false);
  }
  else{
    setSelectedEmployee(employee)
  }
  };

 const handleDelete = async (employee: IEmployee)=> {
  setMessage(null);
   let responseMessage = await deleteEmployee(listName, employee,context);;
     if (responseMessage.startsWith('Success')) {
     const updatedList = employees.filter((emp) => emp.ID !== employee.ID);
     setEmployees(updatedList);
   }
  setMessage(responseMessage);
 };
 
const handleEdit = (employee:IEmployee | null) => {
  setMessage(null);
    if (employee) {
        const emp = employees.find(emp => emp.ID === employee.ID)
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
      <EmployeeTaxonomyForm 
         selectedEmployee={selectedEmployee}
         onSaved={handleSave}
         onReset={() => setSelectedEmployee(null)}
         message={message}
         isModalOpen={isModalOpen}
         onDismiss={() => setIsModalOpen(false)}
         handleAddClick={handleAddClick}
         context={context}
       />
       
       <EmployeeTaxonomyList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
       
      />
    
    </div>
    
  );
};

export default TaxanomyEmployeeExample;   
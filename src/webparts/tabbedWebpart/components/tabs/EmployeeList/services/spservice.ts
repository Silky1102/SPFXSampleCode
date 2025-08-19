 import  { IEmployee } from '../types/IEmployee';

import {getSP} from '../services/pnpjsConfig'
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";



 export const getEmployees = async (listName: string, context:any) : Promise<IEmployee[]> => {
   const sp = getSP(context);
   return await sp.web.lists.getByTitle(listName).items.select("Id", "Title", "Department", "Experience","JoiningDate").top(5000)();
  };


 export const addEmployee = async (listName: string, employee: IEmployee,context:any) => {
      try {
        const sp = getSP(context);
        await sp.web.lists.getByTitle(listName).items.add(employee);
        return "Employee added successfully!";
      } catch (error: any) {
        console.error("Failed to add employee:", error);
        return `Failed to add employee: ${error.message || error}`;
      }
    };

 export const updateEmployee = async (listName: string, employee: IEmployee,context:any): Promise<string | null> => {
      if (!employee.ID) {
         console.error('Employee ID is missing for update.');
         return ('Employee ID is missing for update.');
      }

    try {
       const sp = getSP(context);
       await sp.web.lists.getByTitle(listName).items.getById(employee.ID).update({
            Title: employee.Title,
            Department: employee.Department,
            Experience: employee.Experience,
            JoiningDate: employee.JoiningDate
        });
        return('Employee updated successfully!');
      } catch (error) {
        return(`Failed to update employee: ${error}`);
      }
     
         
   };   

export const deleteEmployee = async (listName: string, employee: IEmployee,context:any) : Promise<string>=> {
      if (employee.ID) {
          try {
          const sp = getSP(context);
          await sp.web.lists.getByTitle(listName).items.getById(employee.ID).delete();
          return 'Employee deleted successfully!';
          } catch (error) {
              return `Error deleting employee: ${error.message}`;
          }
      }
      return 'Employee ID is missing for deletion.';
};
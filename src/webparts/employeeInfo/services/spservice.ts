 import  { IEmployee } from '../types/IEmployee';
 import { SPHttpClient } from '@microsoft/sp-http';

 export const getEmployees = async (listName: string, spHttpClient: SPHttpClient, siteUrl: string) : Promise<IEmployee[]> => {
    const response = await spHttpClient.get(
      `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load employees: ${errorText}`);
    }

    const data = await response.json();
    return data.value as IEmployee[];
  };


 export const addEmployee = async (listName: string, spHttpClient: SPHttpClient, siteUrl: string,employee: IEmployee) => {
         const response = await spHttpClient.post(
          `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-Type': 'application/json;odata=nometadata',
              'odata-version': ''
            },
            body: JSON.stringify(employee)
          }
        );
  
         if (!response.ok) {
          const errorText = await response.text();
          return(`Failed to add employee: ${errorText}`);
        } else {
          return('Employee added successfully!');
        }
    };

 export const updateEmployee = async (listName: string, spHttpClient: SPHttpClient, siteUrl: string,employee: IEmployee): Promise<string | null> => {
      if (!employee.ID) {
         console.error('Employee ID is missing for update.');
         return ('Employee ID is missing for update.');
     }
 
   try {
     let siteAddress= `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${employee.ID})`;
       const response = await spHttpClient.post(
          siteAddress,
           SPHttpClient.configurations.v1,
           {
             headers: {
                 'Accept': 'application/json;odata=nometadata',
                 'Content-Type': 'application/json;odata=nometadata',
                  'odata-version': '',
                 'IF-MATCH': '*', 
                 'X-HTTP-Method': 'MERGE' 
             },
             body: JSON.stringify(employee)
           }
         );
     
         if (response.ok) {
           return('Employee updated successfully!');
           
         }
         else {
         const errorText = await response.text();
           return(`Failed to update employee: ${errorText}`);
       }
     } catch (error) {
       return(`Failed to update employee: ${error.message}`);
     }
   };   

   export const deleteEmployee = async (listName: string, spHttpClient: SPHttpClient, siteUrl: string,employee: IEmployee) : Promise<string>=> {
           if (employee.ID) {
               try {
                   const response = await spHttpClient.post(
                       `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${employee.ID})`,
                       SPHttpClient.configurations.v1,
                       {
                           headers: {
                               'Accept': 'application/json;odata=nometadata',
                               'Content-Type': 'application/json;odata=nometadata',
                               'odata-version': '',
                               'IF-MATCH': '*',
                               'X-HTTP-Method': 'DELETE'
                           }
                       }
                   );
                   if (response.ok) {
                        return 'Employee deleted successfully!';
                   } else {
                       return 'Failed to delete employee';
                   }
               } catch (error) {
                   return `Error deleting employee: ${error.message}`;
               }
           }
           return 'Employee ID is missing for deletion.';
       };
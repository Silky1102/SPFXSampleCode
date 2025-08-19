import  { IEmployee } from '../types/IEmployee';
import {getSP} from '../services/pnpjsConfig'
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import { Title } from 'PortalBannerApplicationCustomizerStrings';

export const getEmployees = async (listName: string, context: any) => {
  const sp = getSP(context);

  // Rendered fields (returns text values as seen in the list UI)
  const renderedData = await sp.web.lists
    .getByTitle(listName)
    .renderListDataAsStream({
      ViewXml: `<View>
                  <ViewFields>
                    <FieldRef Name="ID"/>
                    <FieldRef Name="Title"/>
                    <FieldRef Name="Department"/>
                    <FieldRef Name="Experience"/>
                    <FieldRef Name="JoiningDate"/>
                    <FieldRef Name="Country_x002d_State"/>
                  </ViewFields>
                  <RowLimit>5000</RowLimit>
                </View>`
    });

  const employees: IEmployee[] = renderedData.Row.map((item: any) => ({
    ID: Number(item.ID),
    Title: item.Title,
    Department: item.Department,
    Experience: item.Experience,
    JoiningDate: item.JoiningDate,
    CountryState: {
              Label: item.Country_x002d_State?.Label,
              TermID: item.Country_x002d_State?.TermID,
              WssId: -1
            } 

            
  }));
  return employees;
};

 export const addEmployee = async (listName: string, employee: IEmployee,context:any)  :Promise<{ success: boolean; message: string }>=> {
      try {
        const sp = getSP(context);
        await sp.web.lists.getByTitle(listName).items.add({
          Title:employee.Title,
          Department:employee.Department,
          Experience:employee.Experience,
          JoiningDate:employee.JoiningDate,
          Country_x002d_State: {
              Label: employee.CountryState?.Label,
              TermGuid: employee.CountryState?.TermID,
              WssId: -1
            }
        }
        );
          return { success: true, message: "Employee added successfully!" };
      } catch (error: any) {
        console.error("Failed to add employee:", error);
       return { success: false, message: `Failed to add employee: ${error.message || error}` };
      }
    };

    


 export const updateEmployee = async (listName: string, employee: IEmployee,context:any): Promise<{ success: boolean; message: string }> => {
      if (!employee.ID) {
         console.error('Employee ID is missing for update.');
        return { success: false, message: "Employee ID is missing for update." };
      }

    try {
       const sp = getSP(context);
       await sp.web.lists.getByTitle(listName).items.getById(employee.ID).update({
            Title: employee.Title,
            Department: employee.Department,
            Experience: employee.Experience,
            JoiningDate: employee.JoiningDate ? new Date(employee.JoiningDate).toISOString():null,
            Country_x002d_State: {
            Label: employee.CountryState?.Label,
            TermGuid: employee.CountryState?.TermID,
            WssId: -1 // ✅ Same for update
  }
        });
            return { success: true, message: "Employee updated successfully!" };
        //return('Success : Employee updated successfully!');
      } catch (error) {
          return { success: false, message: `Failed to update employee: ${error.message || error}` };
      }
     
         
   };   

export const deleteEmployee = async (listName: string, employee: IEmployee,context:any) : Promise<string>=> {
      if (employee.ID) {
          try {
          const sp = getSP(context);
          await sp.web.lists.getByTitle(listName).items.getById(employee.ID).delete();
          return 'Success : Employee deleted successfully!';
          } catch (error) {
              return `Error deleting employee: ${error.message}`;
          }
      }
      return 'Employee ID is missing for deletion.';
};
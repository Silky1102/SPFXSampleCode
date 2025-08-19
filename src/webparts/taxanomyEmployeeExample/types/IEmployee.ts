
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEmployee {
  ID?: number;
  Title: string;
  JoiningDate: string;
  Department: string;
  Experience: string;
  CountryState: {
    Label: string;
    TermID: string;
    WssId: number;
  } | null;
}

export interface IEmployeeFormProps {
  onSaved: (employee: IEmployee) => void;
  selectedEmployee?: IEmployee | null;
  onReset ?: () => void;
  message?: string | null;
  isModalOpen: boolean;
  onDismiss: () => void;
  handleAddClick: () => void;
  context:WebPartContext;
}

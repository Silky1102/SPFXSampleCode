export interface IEmployee {
  ID?: number;
  Title: string;
  JoiningDate: string;
  Department: string;
  Experience: string;
}

export interface IEmployeeFormProps {
  onSaved: (employee: IEmployee) => void;
  selectedEmployee?: IEmployee | null;
  onReset ?: () => void;
  message?: string | null;
  isModalOpen: boolean;
  onDismiss: () => void;
  handleAddClick: () => void;
}

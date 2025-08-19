import * as React from 'react';
import  EmployeeDocumentForm from './EmployeeDocumentForm';
import EmployeeDocumentList from './EmployeeDocumentList';
import {  addDocument, getDocuments, updateDocument, deleteDocument} from '../services/spservice';
import { IDocument } from '../types/IDocument';
import {
   DefaultButton,
} from '@fluentui/react';
export interface IDocumentCrudProps {
    libraryName: string;
    context: any; 
}


const DocumentCrud : React.FC <IDocumentCrudProps>= ({libraryName,context}) => {
  const [docs, setDocs] = React.useState<IDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = React.useState<IDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const items = await getDocuments(libraryName,context);
    setDocs(items);
  };

  const handleSave = async (file: File, department: string, itemId?: number) => {
    let msg;
    if (itemId) {
      msg = await updateDocument(libraryName,itemId, department, context);
    } else {
      msg = await addDocument(libraryName,file, department, context);
    }
    setMessage(msg);
    setIsModalOpen(false);
    setSelectedDoc(null);
    await loadDocuments();
  };

  const handleEdit = (doc: IDocument) => {
    setMessage(null);
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = async (doc: IDocument) => {
      setMessage(null);
    const msg = await deleteDocument(doc.ID!, libraryName,context);
    setMessage(msg);
    await loadDocuments();
  };

  const handleAddClick = () => {
    setMessage(null);
    setSelectedDoc(null); 
    setIsModalOpen(true);      
 };
    return (
    <div>
           <EmployeeDocumentForm   selectedDoc={selectedDoc}
            isModalOpen={isModalOpen}
            onDismiss={() => setIsModalOpen(false)}
            onReset={() => setSelectedDoc(null)}
            onSaved={handleSave}
            message={message}/>
           <DefaultButton text="Add Document" onClick={handleAddClick}/>
           <EmployeeDocumentList documents={docs} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
    );
};

export default DocumentCrud;

import {getSP} from '../services/pnpjsConfig'
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { IDocument } from '../types/IDocument';


export const getDocuments = async (libraryName:string,context: any): Promise<IDocument[]> => {
  const sp = getSP(context);

  const items = await sp.web.lists.getByTitle(libraryName).items.select("ID", "File_x0020_Type","FileLeafRef", "FileRef", "Department").top(100)();
  return items.map(i => ({
    ID: i.ID,
    FileName: i.FileLeafRef,
    fileType:i.File_x0020_Type,
    FileRef: i.FileRef,
    Department: i.Department
  }));
};

export const addDocument = async (libraryName:string, file: File, department: string, context: any): Promise<string> => {
  const sp = getSP(context);
  const fileInput = document.getElementById("FileInput") as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    console.error("No file selected");
    return "No file selected";
  }
const fileNamePath = file.name;
let result
  try {
    if (file.size <= 10485760) {
      // Upload small file
      result = await sp.web.getFolderByServerRelativePath(`/sites/Assignment/${libraryName}`).files.addUsingPath(fileNamePath, file, { Overwrite: true });
    } else {
      // Upload large file in chunks
      result = await sp.web.getFolderByServerRelativePath(`/sites/Assignment/${libraryName}`).files.addChunked(fileNamePath, file, {
        progress: (data) => {
          console.log(`progress`); 
        },
        Overwrite: true,
      });
    }

    const uploadedFile = sp.web.getFileByServerRelativePath(result.ServerRelativeUrl);
    console.log(`Result of file upload: ${JSON.stringify(result)}`);
    const item = await (uploadedFile ? uploadedFile.getItem() : sp.web.getFileByServerRelativePath(`/sites/Assignment/${libraryName}/${file.name}`).getItem());
    await item.update({
      Department: department
    });

    console.log("File uploaded and metadata updated successfully.");
     return "File uploaded and metadata updated successfully.";
  } catch (error) {
    console.error("Error uploading document:", error);
     return ("Error uploading document:" + error)
  }
};

export const updateDocument = async (libraryName:string,id: number, department: string, context: any): Promise<string> => {
  const sp = getSP(context);
  await sp.web.lists.getByTitle(libraryName).items.getById(id).update({ Department: department });
  return "Document updated successfully";
};

export const deleteDocument = async (id: number, libraryName:string,context: any): Promise<string> => {
  const sp = getSP(context);
  await sp.web.lists.getByTitle(libraryName).items.getById(id).delete();
  return "Document deleted successfully";
};

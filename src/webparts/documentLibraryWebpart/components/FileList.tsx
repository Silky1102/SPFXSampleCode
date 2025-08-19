import * as React from 'react';
import { IFile} from '../types/IFile';
import {Icon} from '@fluentui/react'

export interface IFileListProps {
  files: IFile[];
}

const FileList: React.FC<IFileListProps> = ({ files }) => {
  return (
    <div>
      {files.map((file, index) => (
        <div key={index} className="file-item">
          <Icon iconName="Document" />
          <span>{file.Name}</span>
        </div>
      ))}
    </div>
  );
}

export default FileList;
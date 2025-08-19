import * as React from 'react';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { FileListViewerProps} from './FileItem';


const FileListViewer: React.FC<FileListViewerProps> = ({ files, siteAbsoluteUrl }) => {
  const columns: IColumn[] = [

    {
      key: 'type',
      name: 'Type',
      fieldName: 'Name',
      minWidth: 100,
      isResizable: true,
      onRender: (item) => item.Name.split('.').pop() ?? 'Folder',
    },
        {
      key: 'name',
      name: 'Name',
      fieldName: 'Name',
      minWidth: 100,
      isResizable: true,
      onRender: (item) => {
    const isWordDoc = item.Name.endsWith('.docx');
    // const siteAbsoluteUrl = context.pageContext.web.absoluteUrl;
    const fileUrl = `${siteAbsoluteUrl}`;
   // const tenant = 'qnm1'; // ← Replace with your tenant like 'contoso'
    const url = isWordDoc
      ? fileUrl +`/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(item.ServerRelativeUrl)}&action=view`
      : item.ServerRelativeUrl;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.Name}
      </a>
    );
  }
}
  ];

  return (
    <div style={{ marginLeft: 20, flex: 1 }}>
      <DetailsList items={files} columns={columns} />
    </div>
  );
};

export default FileListViewer;

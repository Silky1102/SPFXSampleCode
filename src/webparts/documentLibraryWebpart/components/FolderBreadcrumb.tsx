import * as React from 'react';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';

interface IFolderBreadcrumbProps {
  currentPath: string;  // e.g., /HR/Policies
  onBreadcrumbClick: (path: string) => void;
    libraryName: string; // e.g., EmployeeDocumentsLibrary
}

const FolderBreadcrumb: React.FC<IFolderBreadcrumbProps> = ({ libraryName,currentPath, onBreadcrumbClick }) => {
  const items: IBreadcrumbItem[] = [];

  // Always add Root
  items.push({
    text: `${libraryName}`,
    key: `${libraryName}`,
    onClick: () => onBreadcrumbClick('')
  });

  // Add folders in path
  const parts = currentPath.split('/').filter(Boolean);
  parts.forEach((name, index) => {
    const path = '/' + parts.slice(0, index + 1).join('/');
    items.push({
      text: name,
      key: path,
      onClick: () => onBreadcrumbClick(path)
    });
  });

  return (
    <Breadcrumb
      items={items}
      ariaLabel="Folder breadcrumb"
      overflowAriaLabel="More folders"
    />
  );
};

export default FolderBreadcrumb;

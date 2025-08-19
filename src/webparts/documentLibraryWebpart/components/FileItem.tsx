import { INavLink } from '@fluentui/react/lib/Nav';

interface IFileItemProps{
    Name:string;
    ServerRelativeUrl:string
}

export const FileItem = (file: IFileItemProps): INavLink => ({
    key: file.ServerRelativeUrl,
    name:file.Name,
    url:file.ServerRelativeUrl,
}
);

export interface IFileItem {
  Name: string;
  ServerRelativeUrl: string;
}

export interface FileListViewerProps {
  files: IFileItem[];
  siteAbsoluteUrl: string;
}



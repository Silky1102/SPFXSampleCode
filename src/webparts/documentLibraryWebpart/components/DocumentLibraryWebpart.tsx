import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { getSP } from '../services/pnpjsConfig';
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react/lib/Nav';
import FolderItem from './FolderItem';
import { IFileItem} from './FileItem';
import { FileItem } from './FileItem';
import FileListViewer from './FileListViewer';

import type { IDocumentLibraryWebpartProps } from './IDocumentLibraryWebpartProps';


const DocumentLibraryWebpart: React.FC<IDocumentLibraryWebpartProps> = ({ libraryName, context }) => {

  const [selectedFiles, setSelectedFiles] = useState<IFileItem[]>([]);
  const [navGroups, setNavGroups] = useState<INavLinkGroup[]>([
    { links: [] }
  ]);
  const navGroupsRef = useRef(navGroups); // 🔄 Holds the latest navGroup
  const sp = getSP(context);
    const siteAbsoluteUrl = context.pageContext.web.absoluteUrl;

  useEffect(() => {
    navGroupsRef.current = navGroups;
  }, [navGroups]);


  useEffect(() => {
    const loadRootFoldersAndFiles = async () => {
      const webInfo = await sp.web.select('ServerRelativeUrl')();
      const baseFolderPath = `${webInfo.ServerRelativeUrl}/${libraryName}`.replace(/\/{2,}/g, '/');

      const rootFolder = sp.web.getFolderByServerRelativePath(baseFolderPath);
      const [folders, files] = await Promise.all([
        rootFolder.folders.select('Name', 'ServerRelativeUrl')(),
        rootFolder.files.select('Name', 'ServerRelativeUrl')(),
      ]);

      const visibleFolders = folders.filter(f => f.Name !== 'Forms' && f.Name !== 'Site Assets');

      const folderLinks = visibleFolders.map(f => FolderItem(f, handleExpand));
      const fileLinks = files.map(f => FileItem(f));

      setNavGroups([{ links: [...folderLinks, ...fileLinks] }]);
    };

    loadRootFoldersAndFiles();
  }, []);



  const handleExpand = async (folderUrl: string) => {
    const currentLinks = navGroupsRef.current[0]?.links ?? [];
    //const currentLinks = navGroups[0].links; // use the latest value
    //const currentLinks = navGroups[0]?.links ?? [];
    const isCurrentlyExpanded = findIsExpanded(currentLinks, folderUrl);

    if (isCurrentlyExpanded) {
      //  Collapse immediately — no async needed
      const updated = updateLinksRecursive(currentLinks, folderUrl, [], false);
      setNavGroups([{ links: updated }]);
      return;
    }

    //  Expand: fetch subfolders & files first
    const subFolder = sp.web.getFolderByServerRelativePath(folderUrl);
    const [rawSubFolders, subFiles] = await Promise.all([
      subFolder.folders.select('Name', 'ServerRelativeUrl')(),
      subFolder.files.select('Name', 'ServerRelativeUrl')(),
    ]);

    const visibleSubFolders = rawSubFolders.filter(f => f.Name !== 'Forms' && f.Name !== 'Site Assets');
    const childFolders = visibleSubFolders.map(f => FolderItem(f, handleExpand));
    const childFiles = subFiles.map(f => FileItem(f));

    //  Now update with children and set expanded state
    const updated = updateLinksRecursive(currentLinks, folderUrl, [...childFolders, ...childFiles], true);
    console.log('Before updating:');
    logExpanded(currentLinks);
    setNavGroups([{ links: updated }]);
    setSelectedFiles(subFiles); 
  };
  
  const logExpanded = (links: INavLink[], depth = 0) => {
    links.forEach(link => {
      if (link.isExpanded) {
        console.log(`${' '.repeat(depth * 2)}Expanded: ${link.key}`);
      }
      if (link.links) logExpanded(link.links, depth + 1);
    });
  };

  const updateLinksRecursive = (
    links: INavLink[],
    folderUrl: string,
    childLinks: INavLink[],
    isExpand: boolean
  ): INavLink[] => {
    return links.map(link => {
      if (link.key === folderUrl) {
        // Target folder — expand or collapse it
        return {
          ...link,
          isExpanded: isExpand,
          links: isExpand
            ? childLinks
            : [
              {
                name: '',
                key: `${folderUrl}-placeholder`,
                url: '',
              },
            ],
        };
      } else if (link.links) {
        // Recursively update children
        return {
          ...link,
          links: updateLinksRecursive(link.links, folderUrl, childLinks, isExpand),
        };
      } else {
        // No change
        return { ...link };
      }
    });
  };

  const findIsExpanded = (links: INavLink[], folderUrl: string): boolean => {
    for (const link of links) {
      if (link.key === folderUrl) {
        return link.isExpanded ?? false;
      }

      if (link.links && link.links.length > 0) {
        const found = findIsExpanded(link.links, folderUrl);
        if (found === true) {
          return true;
        }
      }
    }

    //If no match was found anywhere
    return false;
  };

return (
  <div style={{ display: 'flex' }}>
    <Nav
      ariaLabel="Folders"
      groups={navGroups}
      selectedKey="key"
      styles={{ root: { width: 300, border: '1px solid #ddd', padding: 10 } }}
      onLinkClick={(ev, item) => {
        ev?.preventDefault();
        item?.onClick?.();
      }}
    />
    <FileListViewer files={selectedFiles} siteAbsoluteUrl={siteAbsoluteUrl} />
  </div>
);

};

export default DocumentLibraryWebpart;

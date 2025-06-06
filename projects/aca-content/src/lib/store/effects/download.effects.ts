/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { AppStore, DownloadNodesAction, getAppSelection, getCurrentVersion, NodeActionTypes, NodeInfo } from '@alfresco/aca-shared/store';
import { DownloadZipDialogComponent } from '@alfresco/adf-content-services';
import { NodeEntry, Version } from '@alfresco/js-api';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentUrlService } from '../../services/content-url.service';

@Injectable()
export class DownloadEffects {
  private store = inject(Store<AppStore>);
  private actions$ = inject(Actions);
  private contentApi = inject(ContentApiService);
  private dialog = inject(MatDialog);
  private contentUrlService = inject(ContentUrlService);

  downloadNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<DownloadNodesAction>(NodeActionTypes.Download),
        map((action) => {
          if (action.payload?.length > 0) {
            this.downloadNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.store
                    .select(getCurrentVersion)
                    .pipe(take(1))
                    .subscribe((version) => {
                      if (version) {
                        this.downloadFileVersion(selection.nodes[0].entry, version.entry);
                      } else {
                        this.downloadNodes(selection.nodes, action.configuration?.focusedElementOnCloseSelector);
                      }
                    });
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  private downloadNodes(toDownload: Array<NodeEntry>, focusedElementSelector?: string) {
    const nodes = toDownload.map((node) => {
      const { id, nodeId, name, isFile, isFolder } = node.entry as any;

      return {
        id: this.isSharedLinkPreview ? id : nodeId || id,
        name,
        isFile,
        isFolder
      };
    });

    if (!nodes || nodes.length === 0) {
      return;
    }

    if (nodes.length === 1) {
      this.downloadNode(nodes[0], focusedElementSelector);
    } else {
      this.downloadZip(nodes, focusedElementSelector);
    }
  }

  private downloadNode(node: NodeInfo, focusedElementSelector?: string) {
    if (node) {
      if (node.isFolder) {
        this.downloadZip([node], focusedElementSelector);
      } else {
        this.downloadFile(node);
      }
    }
  }

  private downloadFile(node: NodeInfo) {
    if (node && !this.isSharedLinkPreview) {
      this.contentUrlService.getNodeContentUrl(node.id, true).subscribe((contentUrl) => {
        this.download(contentUrl, node.name);
      });
    }

    if (node && this.isSharedLinkPreview) {
      this.download(this.contentApi.getSharedLinkContent(node.id, false), node.name);
    }
  }

  private downloadFileVersion(node: NodeInfo, version: Version) {
    if (node && version) {
      this.contentUrlService.getVersionContentUrl(node.id, version.id, true).subscribe((contentUrl) => {
        this.download(contentUrl, node.name);
      });
    }
  }

  private downloadZip(nodes: Array<NodeInfo>, focusedElementSelector?: string) {
    if (nodes && nodes.length > 0) {
      const nodeIds = nodes.map((node) => node.id);

      this.dialog
        .open(DownloadZipDialogComponent, {
          width: '600px',
          disableClose: true,
          data: {
            nodeIds
          }
        })
        .afterClosed()
        .subscribe(() => this.focusAfterClose(focusedElementSelector));
    }
  }

  private download(url: string, fileName: string) {
    if (url && fileName) {
      const link = document.createElement('a');

      link.style.display = 'none';
      link.download = fileName;
      link.href = url;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private get isSharedLinkPreview() {
    return location.href.includes('/preview/s/');
  }

  private focusAfterClose(focusedElementSelector: string): void {
    if (focusedElementSelector) {
      document.querySelector<HTMLElement>(focusedElementSelector)?.focus();
    }
  }
}

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

import { RuleContext } from '@alfresco/adf-extensions';

/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 */
export function isPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && (url.includes('/preview/') || url.includes('viewer:view') || url.includes('/view/'));
}

/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 */
export function isFavorites(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/favorites') && !isPreview(context);
}

/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 */
export function isSharedFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/shared') && !isPreview(context);
}

/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 */
export function isTrashcan(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/trashcan');
}

/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 */
export function isPersonalFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/personal-files');
}

/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraries(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.endsWith('/libraries') || url?.startsWith('/search-libraries');
}

export function isLibraryContent(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.endsWith('/libraries') || url?.includes('/libraries/') || url?.startsWith('/search-libraries');
}

export function isDetails(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.includes('/details');
}

/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 */
export function isRecentFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/recent-files');
}

/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 */
export function isSearchResults(
  context: RuleContext
  // ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/search');
}

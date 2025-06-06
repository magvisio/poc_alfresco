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

import * as app from './navigation.rules';

describe('navigation.evaluators', () => {
  describe('isPreview', () => {
    it('should return [true] if url contains `viewer:view`', () => {
      const context: any = {
        navigation: {
          url: 'path/(viewer:view/id)'
        }
      };

      expect(app.isPreview(context)).toBe(true);
    });
  });

  describe('isFavorites', () => {
    it('should return [true] if url contains `/favorites`', () => {
      const context: any = {
        navigation: {
          url: '/favorites/path'
        }
      };

      expect(app.isFavorites(context)).toBe(true);
    });

    it('should return [false] if `/favorites` url contains `/preview/`', () => {
      const context: any = {
        navigation: {
          url: '/favorites/preview/'
        }
      };

      expect(app.isFavorites(context)).toBe(false);
    });
  });

  describe('isSharedFiles', () => {
    it('should return [true] if path starts with `/shared`', () => {
      const context: any = {
        navigation: {
          url: '/shared/path'
        }
      };

      expect(app.isSharedFiles(context)).toBe(true);
    });

    it('should return [false] if `/shared` url contains `/preview/`', () => {
      const context: any = {
        navigation: {
          url: '/shared/preview/'
        }
      };

      expect(app.isSharedFiles(context)).toBe(false);
    });
  });

  describe('isTrashcan', () => {
    it('should return [true] if url starts with `/trashcan`', () => {
      const context: any = {
        navigation: {
          url: '/trashcan'
        }
      };

      expect(app.isTrashcan(context)).toBe(true);
    });

    it('should return [false] if url does not start with `/trashcan`', () => {
      const context: any = {
        navigation: {
          url: '/path/trashcan'
        }
      };

      expect(app.isTrashcan(context)).toBe(false);
    });
  });

  describe('isPersonalFiles', () => {
    it('should return [true] if url starts with `/personal-files`', () => {
      const context: any = {
        navigation: {
          url: '/personal-files'
        }
      };

      expect(app.isPersonalFiles(context)).toBe(true);
    });

    it('should return [false] if url does not start with `/personal-files`', () => {
      const context: any = {
        navigation: {
          url: '/path/personal-files'
        }
      };

      expect(app.isPersonalFiles(context)).toBe(false);
    });
  });

  describe('isLibraries', () => {
    it('should return [true] if url ends with `/libraries`', () => {
      const context: any = {
        navigation: {
          url: '/path/libraries'
        }
      };

      expect(app.isLibraries(context)).toBe(true);
    });

    it('should return [true] if url starts with `/search-libraries`', () => {
      const context: any = {
        navigation: {
          url: '/search-libraries/path'
        }
      };

      expect(app.isLibraries(context)).toBe(true);
    });
  });

  describe('isDetails', () => {
    it('should return true if url includes with `/details`', () => {
      const context: any = {
        navigation: {
          url: '/details/path'
        }
      };

      expect(app.isDetails(context)).toBe(true);
    });

    it('should return false if url not includes with `/details`', () => {
      const context: any = {
        navigation: {
          url: '/path'
        }
      };

      expect(app.isDetails(context)).toBe(false);
    });
  });

  describe('isRecentFiles', () => {
    it('should return [true] if url starts with `/recent-files`', () => {
      const context: any = {
        navigation: {
          url: '/recent-files'
        }
      };

      expect(app.isRecentFiles(context)).toBe(true);
    });

    it('should return [false] if url does not start with `/recent-files`', () => {
      const context: any = {
        navigation: {
          url: '/path/recent-files'
        }
      };

      expect(app.isRecentFiles(context)).toBe(false);
    });
  });

  describe('isSearchResults', () => {
    it('should return [true] if url starts with `/search`', () => {
      const context: any = {
        navigation: {
          url: '/search'
        }
      };

      expect(app.isSearchResults(context)).toBe(true);
    });

    it('should return [false] if url does not start with `/search`', () => {
      const context: any = {
        navigation: {
          url: '/path/search'
        }
      };

      expect(app.isSearchResults(context)).toBe(false);
    });
  });
});

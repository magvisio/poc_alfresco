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

import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Directionality } from '@angular/cdk/bidi';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { CONTEXT_MENU_CUSTOM_ACTIONS } from './custom-context-menu-actions.token';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CustomContextMenuComponent } from './custom-context-menu.component';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private direction: Directionality;

  constructor(
    private readonly injector: Injector,
    private readonly overlay: Overlay,
    private readonly userPreferenceService: UserPreferencesService
  ) {
    this.userPreferenceService.select('textOrientation').subscribe((textOrientation) => {
      this.direction = textOrientation;
    });
  }

  open(config: ContextmenuOverlayConfig, customActions?: ContentActionRef[]): ContextMenuOverlayRef {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);
    if (customActions?.length) {
      this.attachCustomDialogContainer(overlay, overlayRef, customActions);
    } else {
      this.attachDialogContainer(overlay, overlayRef);
    }

    return overlayRef;
  }

  private createOverlay(config: ContextmenuOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlay: OverlayRef, contextmenuOverlayRef: ContextMenuOverlayRef): ContextMenuComponent {
    const injector = this.createInjector(contextmenuOverlayRef);
    const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(contextmenuOverlayRef: ContextMenuOverlayRef): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ContextMenuOverlayRef, useValue: contextmenuOverlayRef },
        { provide: CONTEXT_MENU_DIRECTION, useValue: this.direction }
      ]
    });
  }

  private attachCustomDialogContainer(
    overlay: OverlayRef,
    contextmenuOverlayRef: ContextMenuOverlayRef,
    customActions: ContentActionRef[]
  ): CustomContextMenuComponent {
    const injector = this.createCustomInjector(contextmenuOverlayRef, customActions);
    const containerPortal = new ComponentPortal(CustomContextMenuComponent, null, injector);
    const containerRef: ComponentRef<CustomContextMenuComponent> = overlay.attach(containerPortal);

    return containerRef.instance;
  }

  private createCustomInjector(contextmenuOverlayRef: ContextMenuOverlayRef, customActions: ContentActionRef[]): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ContextMenuOverlayRef, useValue: contextmenuOverlayRef },
        { provide: CONTEXT_MENU_DIRECTION, useValue: this.direction },
        { provide: CONTEXT_MENU_CUSTOM_ACTIONS, useValue: customActions }
      ]
    });
  }

  private getOverlayConfig(config: ContextmenuOverlayConfig): OverlayConfig {
    const { x, y } = config.source;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy,
      direction: this.direction
    });
  }
}

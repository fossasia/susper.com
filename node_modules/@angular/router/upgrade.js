/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ApplicationRef } from '@angular/core';
import { ROUTER_CONFIGURATION, ROUTER_INITIALIZER, Router, RouterPreloader } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';
/**
 * @whatItDoes Creates an initializer that in addition to setting up the Angular 2
 * router sets up the ngRoute integration.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * @experimental
 */
export var RouterUpgradeInitializer = {
    provide: ROUTER_INITIALIZER,
    useFactory: initialRouterNavigation,
    deps: [UpgradeModule, ApplicationRef, RouterPreloader, ROUTER_CONFIGURATION]
};
/**
 * @internal
 */
export function initialRouterNavigation(ngUpgrade, ref, preloader, opts) {
    return function () {
        if (!ngUpgrade.$injector) {
            throw new Error("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
        }
        var router = ngUpgrade.injector.get(Router);
        var ref = ngUpgrade.injector.get(ApplicationRef);
        router.resetRootComponentType(ref.componentTypes[0]);
        preloader.setUpPreloading();
        if (opts.initialNavigation === false) {
            router.setUpLocationChangeListener();
        }
        else {
            router.initialNavigation();
        }
        setUpLocationSync(ngUpgrade);
    };
}
/**
 * @whatItDoes Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the angular2 location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * @experimental
 */
export function setUpLocationSync(ngUpgrade) {
    var router = ngUpgrade.injector.get(Router);
    var url = document.createElement('a');
    ngUpgrade.$injector.get('$rootScope')
        .$on('$locationChangeStart', function (_, next, __) {
        url.href = next;
        router.navigateByUrl(url.pathname);
    });
}
//# sourceMappingURL=upgrade.js.map
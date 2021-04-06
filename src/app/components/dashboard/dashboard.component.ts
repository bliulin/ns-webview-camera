import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private url: string;
    private unsubscribe$: Subject<any> = new Subject<any>();
    constructor(private routerExt: RouterExtensions, private route: ActivatedRoute, private page: Page) {
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
        this.routerExt.router.events
            .pipe(takeUntil(this.unsubscribe$))
            .pipe(filter(ev => ev instanceof NavigationEnd))
            .subscribe((ev: NavigationEnd) => (this.url = ev.urlAfterRedirects));
    }

    public ngOnInit(): void {
        //todo handle back button to always redirect to homepage
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public navigate(path: string): void {
        this.routerExt.navigate([{ outlets: { dashboard: path } }], { relativeTo: this.route });
    }

    public isRouteActive(url: string): boolean {
        return this.url.includes(url);
    }
}

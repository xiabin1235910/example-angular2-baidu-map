import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, RouteConfig} from "@angular/router-deprecated";
import {dashboardComponent} from "./components/dashboard.component";

@Component({
    selector: 'main-app',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/dashboard', name: 'Dashboard', component: dashboardComponent, useAsDefault: true}
])
export class AppComponent {
}
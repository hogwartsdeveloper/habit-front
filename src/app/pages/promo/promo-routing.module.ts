import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PromoComponent} from "./promo/promo.component";
import {LearnComponent} from "./learn/learn.component";

const routes: Routes = [
    {
        path: '',
        component: PromoComponent,
    },
    {
        path: 'learn',
        component: LearnComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromoRoutingModule {}
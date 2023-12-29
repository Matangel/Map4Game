import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPage } from './map/pages/map.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./map/map.module').then(m => m.MapModule)
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: '/'
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

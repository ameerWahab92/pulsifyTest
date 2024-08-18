import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// MainListModule
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/main-list/main-list.module').then((m) => m.MainListModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

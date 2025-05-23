import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { ROOT_REDUCERS } from './reducers';

@NgModule({
  imports: [
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    !environment.production
      ? (StoreDevtoolsModule.instrument({
          name: 'Youtube History App Store',
        }) as any)
      : [],
  ],
  exports: [StoreModule, StoreDevtoolsModule],
})
export class StoreModuleProvider {}

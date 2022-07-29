import { HomeRoutes } from './home.routing.module';
import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from 'src/shared';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HomeComponent } from './home.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

registerLocaleData(en);

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    NzFormModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzLayoutModule,
    NzIconModule,
    SharedModule,
    HomeRoutes
    
  ],
})
export class HomeModule { }

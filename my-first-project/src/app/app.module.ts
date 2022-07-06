import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// ？引入路由？
import { AppRoutingModule } from './app-routing.module';
// 引入app.component.ts 组件时不用加ts
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { AngularTest } from './angular-test/angularTest.component';
import { HomeTest } from './home-test/homeTest.component';
import { ProductAlertsComponent } from './product-alerts/product-alerts.component';

@NgModule({
  // 只能声明组件、指令和管道。
  declarations: [
    AppComponent,
    ProductAlertsComponent
  ],
  // 依赖的其他模块
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  // 默认情况下它是空的，用来声明模块中提供了什么服务
  providers: [],
  // bootstrap，声明主组件是什么
  bootstrap: [AppComponent]
})
export class AppModule { }

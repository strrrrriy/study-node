1. 创建一个组件快捷方式：`create a component：ng generate component <component name>`

2. 创建项目:`ng new my-app`
ng new 命令会提示你提供要把哪些特性包含在初始应用中。按 Enter 或 Return 键可以接受默认值。
3. 运行项目：`ng serve` 或者 `npm run serve`

4. 创建可注入服务:`ng generate service heroes/hero`
`ng generate module heroes/heroes --module app --flat --routing`

5. angularcil将css换为scss
安装：`npm install -g sass`
方法一：
新增的时候就默认为scss
`ng new My_New_Project --style=scss`

方法二：
1、修改.angular-cli.json配置文件：
```json
"defaults": {
     "styleExt": "scss",
}
"styles": [
        "styles.scss"
      ],
```
2、在src目录下新增文件_variables.scss
3、style.scss文件里配置如下：
```scss
@import 'variables';
@import '../node_modules/bootstrap/scss/bootstrap';
```

6. 特性模块
`ng generate module CustomerDashboard`
```ts
//第一个导入了 NgModule，它像根模块中一样让你能使用 @NgModule 装饰器；
import { NgModule } from '@angular/core';
//第二个导入了 CommonModule，它提供了很多像 ngIf 和 ngFor 这样的常用指令。
//特性模块导入 CommonModule，而不是 BrowserModule，后者只应该在根模块中导入一次。
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CustomerDashboardModule { }
```
declarations 数组让你能添加专属于这个模块的可声明对象（组件、指令和管道）。 要添加组件，就在命令行中输入如下命令，这里的 customer-dashboard 是一个目录，CLI 会把特性模块生成在这里，而 CustomerDashboard 就是该组件的名字：

`ng generate component customer-dashboard/CustomerDashboard`

**如果你往该特性模块中加入过任何服务提供者，AppModule 也同样会知道它，其它模块中也一样。不过，NgModule 并不会暴露出它们的组件。**

渲染特性模块的组件模板

要想在 AppComponent 中查看这些 HTML，你首先要在 CustomerDashboardModule 中导出 CustomerDashboardComponent。 在 customer-dashboard.module.ts 中，declarations 数组的紧下方，加入一个包含 CustomerDashboardModule 的 exports 数组：

```ts
exports: [
  CustomerDashboardComponent
]
```
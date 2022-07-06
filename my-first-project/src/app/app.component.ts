// Angular核心模块里面引入了component装饰器
import { Component } from '@angular/core';
// 用装饰器定义了一个组件以及组件的元数据 所有的组件都必须使用这个装饰器来注解
//,@Component 装饰器能接受一个配置对象，并把紧随其后的类标记成了组件类。
// Angular 会基于这些信息创建和展示组件及其视图。
@Component({
  // selector就是css选择器，表示这个组件可以通过app-root的HTML页面标签来来调用
  selector: 'app-root',
  //emplate
  templateUrl: './app.component.html',
  //style,array类型,多个
  styleUrls: ['./app.component.css'],
  // 定义子组件
  // directives : [ComponentDetails]
})
// @Component({
//   selector:'app-root',
//   templateUrl:'',
//   styleUrls: ['']
// })
// controller
//这个类实际上就是该组件的控制器，我们的业务逻辑就是在这个类中编写
export class AppComponent {
  // 使用模板字符串可以直接访问
  title = 'my-first-project';
  userLoggedIn = true;
  user = {
    admin : true,
    id : 0
  };
  courses = ["math","english"]
  // courses = []

}
/*
 *装饰器，模板和控制器是组件的必备要素。还有一些可选的元素，比如：
 *输入属性（@inputs）:是用来接收外部传入的数据的,Angular的程序结构就是一个组件树，输入属性允许在组件树种传递数据
 *提供器（providers）：这个是用来做依赖注入的
 *生命周期钩子（LifeCycle Hooks）：一个组件从创建到销毁的过程中会有多个钩子会被触发，类似于Android中的Activity的生命周期
 *样式表：组件可以关联一些样式表
 *动画（Animations）： Angular提供了一个动画包来帮助我们方便的创建一些跟组件相关的动画效果，比如淡入淡出等
 *输出属性（@Outputs）：用来定义一些其他组件可能需要的事件或者用来在组件之间共享数据
 */

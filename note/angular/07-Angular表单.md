# 1. Angular 表单简介
应用通过表单来让用户登录、修改个人档案、输入敏感信息以及执行各种数据输入任务。

Angular 提供了两种不同的方法来通过表单处理用户输入：响应式表单和模板驱动表单。 两者都从视图中捕获用户输入事件、验证用户输入、创建表单模型、修改数据模型，并提供跟踪这些更改的途径。

## 1.1. 选择一种方法
* 响应式表单

提供对底层表单对象模型直接、显式的访问。它们与模板驱动表单相比，更加健壮：它们的可扩展性、可复用性和可测试性都更高。如果表单是你的应用程序的关键部分，或者你已经在使用响应式表单来构建应用，那就使用响应式表单。

* 模板驱动表单

依赖模板中的指令来创建和操作底层的对象模型。它们对于向应用添加一个简单的表单非常有用，比如电子邮件列表注册表单。它们很容易添加到应用中，但在扩展性方面不如响应式表单。如果你有可以只在模板中管理的非常基本的表单需求和逻辑，那么模板驱动表单就很合适。

* 关键差异

1. 响应式: 建立表单模型是显式的，在组件类中创建；数据模型是结构化和不可变的；数据流是同步；表单验证是函数

2. 模板驱动：建立表单模型是隐式的，由指令创建；数据模型是非结构化和可变的；数据流是异步；表单验证是指令

可伸缩性：如果表单是应用程序的核心部分，那么可伸缩性就非常重要。能够跨组件复用表单模型是至关重要的。响应式表单比模板驱动表单更有可伸缩性。它们提供对底层表单 API 的直接访问，并且在视图和数据模型之间使用同步数据流，从而可以更轻松地创建大型表单。响应式表单需要较少的测试设置，测试时不需要深入理解变更检测，就能正确测试表单更新和验证。模板驱动表单专注于简单的场景，可复用性没那么高。它们抽象出了底层表单 API，并且在视图和数据模型之间使用异步数据流。对模板驱动表单的这种抽象也会影响测试。测试程序非常依赖于手动触发变更检测才能正常运行，并且需要进行更多设置工作。

## 1.2 建立表单模型
响应式表单和模板驱动型表单都会跟踪用户与之交互的表单输入元素和组件模型中的表单数据之间的值变更。这两种方法共享同一套底层构建块，只在如何创建和管理常用表单控件实例方面有所不同。

**常用表单基础类**
1. FormControl	追踪单个表单控件的值和验证状态。
2. FormGroup	追踪一个表单控件组的值和状态。
3. FormArray	追踪表单控件数组的值和状态。
4. ControlValueAccessor	在 Angular 的 FormControl 实例和内置 DOM 元素之间创建一个桥梁

* 建立响应式表单

对于响应式表单，你可以直接在组件类中定义表单模型。`[formControl]` 指令会通过内部值访问器来把显式创建的 `FormControl` 实例与视图中的特定表单元素联系起来。

```ts
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
//表单模型是 FormControl 实例。
@Component({
  selector: 'app-reactive-favorite-color',
  template: `
    Favorite Color: <input type="text" [formControl]="favoriteColorControl">
  `
})
export class FavoriteColorComponent {
  favoriteColorControl = new FormControl('');
}
//表单模型是事实之源（source of truth）的,它通过输入元素上的 [formControl] 指令，在任何给定的时间点提供表单元素的值和状态。
```
![](https://angular.cn/generated/images/guide/forms-overview/key-diff-reactive-forms.png)

* 建立模板驱动表单

在模板驱动表单中，表单模型是隐式的，而不是显式的。指令 `NgModel` 为指定的表单元素创建并管理一个 `FormControl` 实例。
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-template-favorite-color',
  template: `
    Favorite Color: <input type="text" [(ngModel)]="favoriteColor">
  `
})
export class FavoriteColorComponent {
  favoriteColor = '';
}
//在模板驱动表单中，其事实之源就是模板。你没有对 FormControl 实例的直接编程访问
```
![](https://angular.cn/generated/images/guide/forms-overview/key-diff-td-forms.png)

## 1.3 表单中的数据流
当应用包含一个表单时，Angular 必须让该视图与组件模型保持同步，并让组件模型与视图保持同步。当用户通过视图更改值并进行选择时，新值必须反映在数据模型中。同样，当程序逻辑改变数据模型中的值时，这些值也必须反映到视图中。

* 响应式表单中的数据流
在响应式表单中，视图中的每个表单元素都直接链接到一个表单模型（FormControl 实例）。 从视图到模型的修改以及从模型到视图的修改都是同步的，而且不依赖于 UI 的渲染方式。

视图->模型
1. 最终用户在输入框元素中键入了一个值，这里是 "Blue"。
2. 这个输入框元素会发出一个带有最新值的 "input" 事件。
3. 这个控件值访问器 ControlValueAccessor 会监听表单输入框元素上的事件，并立即把新值传给 FormControl 实例。
4. FormControl 实例会通过 valueChanges 这个可观察对象发出这个新值。
5. valueChanges 的任何一个订阅者都会收到这个新值。

![](https://angular.cn/generated/images/guide/forms-overview/dataflow-reactive-forms-vtm.png)

模型->视图
1. favoriteColorControl.setValue() 方法被调用，它会更新这个 FormControl 的值。
2. FormControl 实例会通过 valueChanges 这个可观察对象发出新值。
3. valueChanges 的任何订阅者都会收到这个新值。
4. 该表单输入框元素上的控件值访问器会把控件更新为这个新值。

![](https://angular.cn/generated/images/guide/forms-overview/dataflow-reactive-forms-mtv.png)

* 模板驱动表单中的数据流
在模板驱动表单中，每一个表单元素都是和一个负责管理内部表单模型的指令关联起来的。

视图->模型
1. 最终用户在输入框元素中敲 "Blue"。
2. 该输入框元素会发出一个 "input" 事件，带着值 "Blue"。
3. 附着在该输入框上的控件值访问器会触发 FormControl 实例上的 setValue() 方法。
4. FormControl 实例通过 valueChanges 这个可观察对象发出新值。
5. valueChanges 的任何订阅者都会收到新值。
6. 控件值访问器 ControlValueAccessory 还会调用 NgModel.viewToModelUpdate() 方法，它会发出一个 ngModelChange 事件。
7. 由于该组件模板双向数据绑定到了 favoriteColor，组件中的 favoriteColor 属性就会修改为 ngModelChange 事件所发出的值（"Blue"）。

![](https://angular.cn/generated/images/guide/forms-overview/dataflow-td-forms-vtm.png)

模型->视图

1. 组件中修改了 favoriteColor 的值。
2. 变更检测开始。
3. 在变更检测期间，由于这些输入框之一的值发生了变化，Angular 就会调用 NgModel 指令上的 ngOnChanges 生命周期钩子。
4. ngOnChanges() 方法会把一个异步任务排入队列，以设置内部 FormControl 实例的值。
5. 变更检测完成。
6. 在下一个检测周期，用来为 FormControl 实例赋值的任务就会执行。
7. FormControl 实例通过可观察对象 valueChanges 发出最新值。
8. valueChanges 的任何订阅者都会收到这个新值。
9. 控件值访问器 ControlValueAccessor 会使用 favoriteColor 的最新值来修改表单的输入框元素。

![](https://angular.cn/generated/images/guide/forms-overview/dataflow-td-forms-mtv.png)

* 数据模型的可变性
变更追踪的方法对应用的效率有着重要影响。

1. 响应式表单: 通过以不可变的数据结构提供数据模型，来保持数据模型的纯粹性。每当在数据模型上触发更改时，FormControl 实例都会返回一个新的数据模型，而不会更新现有的数据模型。这使你能够通过该控件的可观察对象跟踪对数据模型的唯一更改。这让变更检测更有效率，因为它只需在唯一性更改（译注：也就是对象引用发生变化）时进行更新。由于数据更新遵循响应式模式，因此你可以把它和可观察对象的各种运算符集成起来以转换数据。

2. 模板驱动表单: 依赖于可变性和双向数据绑定，可以在模板中做出更改时更新组件中的数据模型。由于使用双向数据绑定时没有用来对数据模型进行跟踪的唯一性更改，因此变更检测在需要确定何时更新时效率较低。
前面那些使用 favorite-color 输入元素的例子就演示了这种差异。

对于响应式表单，当控件值更新时，FormControl 的实例总会返回一个新值

对于模板驱动表单，favorite-color 属性总会被修改为新值

## 1.4 表单验证
验证是管理任何表单时必备的一部分。无论你是要检查必填项，还是查询外部 API 来检查用户名是否已存在，Angular 都会提供一组内置的验证器，以及创建自定义验证器所需的能力。

响应式表单: 把自定义验证器定义成函数，它以要验证的控件作为参数

模板驱动表单: 和模板指令紧密相关，并且必须提供包装了验证函数的自定义验证器指令
## 1.5 测试

测试在复杂的应用程序中也起着重要的作用。当验证你的表单功能是否正确时，更简单的测试策略往往也更有用。测试响应式表单和模板驱动表单的差别之一在于它们是否需要渲染 UI 才能基于表单控件和表单字段变化来执行断言。下面的例子演示了使用响应式表单和模板驱动表单时表单的测试过程。

* 测试响应式表单
响应式表单提供了相对简单的测试策略，因为它们能提供对表单和数据模型的同步访问，而且不必渲染 UI 就能测试它们。在这些测试中，控件和数据是通过控件进行查询和操纵的，不需要和变更检测周期打交道。

下面的测试利用前面例子中的 "喜欢的颜色" 组件来验证响应式表单中的 "从视图到模型" 和 "从模型到视图" 数据流。

从视图到模型

1. 查询表单输入框元素的视图，并为测试创建自定义的 "input" 事件
2. 把输入的新值设置为 Red，并在表单输入元素上调度 "input" 事件。
3. 断言该组件的 favoriteColorControl 的值与来自输入框的值是匹配的。
```ts
it('should update the value of the input field', () => {
  const input = fixture.nativeElement.querySelector('input');
  const event = createNewEvent('input');

  input.value = 'Red';
  input.dispatchEvent(event);

  expect(fixture.componentInstance.favoriteColorControl.value).toEqual('Red');
});
```

从模型到视图

1. 使用 favoriteColorControl 这个 FormControl 实例来设置新值。
2. 查询表单中输入框的视图。
3. 断言控件上设置的新值与输入中的值是匹配的。

```ts
it('should update the value in the control', () => {
  component.favoriteColorControl.setValue('Blue');

  const input = fixture.nativeElement.querySelector('input');

  expect(input.value).toBe('Blue');
});
```

* 测试模板驱动表单
使用模板驱动表单编写测试就需要详细了解变更检测过程，以及指令在每个变更检测周期中如何运行，以确保在正确的时间查询、测试或更改元素。

下面的测试使用了以前的 "喜欢的颜色" 组件，来验证模板驱动表单的 "从视图到模型" 和 "从模型到视图" 数据流。

从视图到模型
1. 查询表单输入元素中的视图，并为测试创建自定义 "input" 事件。
2. 把输入框的新值设置为 Red，并在表单输入框元素上派发 "input" 事件。
3. 通过测试夹具（Fixture）来运行变更检测。
4. 断言该组件 favoriteColor 属性的值与来自输入框的值是匹配的。

```ts
it('should update the favorite color in the component', fakeAsync(() => {
     const input = fixture.nativeElement.querySelector('input');
     const event = createNewEvent('input');

     input.value = 'Red';
     input.dispatchEvent(event);

     fixture.detectChanges();

     expect(component.favoriteColor).toEqual('Red');
   }));
```

从模型到视图
1. 使用组件实例来设置 favoriteColor 的值。
2. 通过测试夹具（Fixture）来运行变更检测。
3. 在 fakeAsync() 任务中使用 tick() 方法来模拟时间的流逝。
4. 查询表单输入框元素的视图。
5. 断言输入框的值与该组件实例的 favoriteColor 属性值是匹配的。

```ts
it('should update the favorite color on the input field', fakeAsync(() => {
     component.favoriteColor = 'Blue';

     fixture.detectChanges();

     tick();

     const input = fixture.nativeElement.querySelector('input');

     expect(input.value).toBe('Blue');
   }));
```

# 2. 响应式表单

响应式表单使用显式的、不可变的方式，管理表单在特定的时间点上的状态。对表单状态的每一次变更都会返回一个新的状态，这样可以在变化时维护模型的整体性。响应式表单是围绕 Observable 流构建的，表单的输入和值都是通过这些输入值组成的流来提供的，它可以同步访问。

响应式表单与模板驱动表单有着显著的不同点。响应式表单通过对数据模型的同步访问提供了更多的可预测性，使用 Observable 的操作符提供了不可变性，并且通过 Observable 流提供了变化追踪功能。

模板驱动表单允许你直接在模板中修改数据，但不像响应式表单那么明确，因为它们依赖嵌入到模板中的指令，并借助可变数据来异步跟踪变化。参阅表单概览以了解这两种范式之间的详细比较。

## 2.1 添加基础表单控件
使用表单控件有三个步骤。
1. 在你的应用中注册响应式表单模块。该模块声明了一些你要用在响应式表单中的指令。
2. 生成一个新的 FormControl 实例，并把它保存在组件中。
3. 在模板中注册这个 FormControl。

```ts

// 1. 注册响应式表单模块
// 要使用响应式表单控件，就要从 @angular/forms 包中导入 ReactiveFormsModule，并把它添加到你的 NgModule 的 imports 数组中。
// src/app/app.module.ts (excerpt)
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // other imports ...
    ReactiveFormsModule
  ],
})
export class AppModule { }

// 2. 生成新的 FormControl
// 使用 CLI 命令 ng generate 在项目中生成一个组件作为该表单控件的宿主。
// src/app/name-editor/name-editor.component.ts
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-name-editor',
  templateUrl: './name-editor.component.html',
  styleUrls: ['./name-editor.component.css']
})
export class NameEditorComponent {
  name = new FormControl('');
}
// 可以用 FormControl 的构造函数设置初始值，这个例子中它是空字符串。通过在你的组件类中创建这些控件，你可以直接对表单控件的状态进行监听、修改和校验。

// 3. 在模板中注册该控件
//src/app/name-editor/name-editor.component.html
<label for="name">Name: </label>
<input id="name" type="text" [formControl]="name">

//4. 显示该组件
<app-name-editor></app-name-editor>
```
## 2.2 显示表单控件的值
你可以用下列方式显示它的值。

1. 通过可观察对象 valueChanges，你可以在模板中使用 AsyncPipe 或在组件类中使用 subscribe() 方法来监听表单值的变化。

2. 使用 value 属性。它能让你获得当前值的一份快照。

```html
<!-- 插值显示当前 -->
<p>Value: {{ name.value }}</p>
```

## 2.3 替换表单控件的值

响应式表单还有一些方法可以用编程的方式修改控件的值，它让你可以灵活的修改控件的值而不需要借助用户交互。FormControl 实例提供了一个 setValue() 方法，它会修改这个表单控件的值，并且验证与控件结构相对应的值的结构。

使用 setValue() 方法来修改 Nancy 控件的值。

```ts
updateName() {
  this.name.setValue('Nancy');
}
//修改模板，添加一个按钮，用于模拟改名操作。在点 Update Name 按钮之前表单控件元素中输入的任何值都会回显为它的当前值。
<button type="button" (click)="updateName()">Update Name</button>
```
在这个例子中，你只使用单个控件，但是当调用 FormGroup 或 FormArray 实例的 setValue() 方法时，传入的值就必须匹配控件组或控件数组的结构才行。

## 2.4 把表单控件分组
表单中通常会包含几个相互关联的控件。响应式表单提供了两种把多个相关控件分组到同一个输入表单中的方法。

表单分组: 定义了一个带有一组控件的表单，可以把它们放在一起管理。可以通过嵌套表单组来创建更复杂的表单。

表单数组: 定义了一个动态表单，你可以在运行时添加和删除控件。你也可以通过嵌套表单数组来创建更复杂的表单。

就像 FormControl 的实例能让你控制单个输入框所对应的控件一样，FormGroup 的实例也能跟踪一组 FormControl 实例（比如一个表单）的表单状态。当创建 FormGroup 时，其中的每个控件都会根据其名字进行跟踪。下面的例子展示了如何管理单个控件组中的多个 FormControl 实例。

1. 生成一个 ProfileEditor 组件并从 @angular/forms 包中导入 FormGroup 和 FormControl 类。
2. 要将表单组添加到此组件中，请执行以下步骤。
```ts
// 1. 创建一个 FormGroup 实例。
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });
}
//这些独立的表单控件被收集到了一个控件组中。这个 FormGroup 用对象的形式提供了它的模型值，这个值来自组中每个控件的值。FormGroup 实例拥有和 FormControl 实例相同的属性（比如 value、untouched）和方法（比如 setValue()）
// 2. 把这个 FormGroup 模型关联到视图。
//就像 FormGroup 所包含的那控件一样，profileForm 这个 FormGroup 也通过 FormGroup 指令绑定到了 form 元素，在该模型和表单中的输入框之间创建了一个通讯层。
<form [formGroup]="profileForm">

  <label for="first-name">First Name: </label>
  <input id="first-name" type="text" formControlName="firstName">

  <label for="last-name">Last Name: </label>
  <input id="last-name" type="text" formControlName="lastName">

</form>
//由 FormControlName 指令提供的 formControlName 属性把每个输入框和 FormGroup 中定义的表单控件绑定起来。这些表单控件会和相应的元素通讯，它们还把更改传给 FormGroup，这个 FormGroup 是模型值的事实之源。
// 3. 保存表单数据。

// ProfileEditor 组件从用户那里获得输入，但在真实的场景中，你可能想要先捕获表单的值，等将来在组件外部进行处理。FormGroup 指令会监听 form 元素发出的 submit 事件，并发出一个 ngSubmit 事件，让你可以绑定一个回调函数。把 onSubmit() 回调方法添加为 form 标签上的 ngSubmit 事件监听器。
//src/app/profile-editor/profile-editor.component.html (submit event)
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">

//ProfileEditor 组件上的 onSubmit() 方法会捕获 profileForm 的当前值。要保持该表单的封装性，就要使用 EventEmitter 向组件外部提供该表单的值。下面的例子会使用 console.warn 把这个值记录到浏览器的控制台中。
onSubmit() {
  // TODO: Use EventEmitter with form value
  console.warn(this.profileForm.value);
}

//form 标签所发出的 submit 事件是内置 DOM 事件，通过点击类型为 submit 的按钮可以触发本事件。这还让用户可以用回车键来提交填完的表单。往表单的底部添加一个 button，用于触发表单提交。
<p>Complete the form to enable button.</p>
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```
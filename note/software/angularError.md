# 1. How To Fix Error PS1 Can Not Be Loaded Because Running Scripts Is Disabled On This System In Angular
## 1.1 Introduction 
When you have to run your Angular project or any ng command, you may see that the system shows the below error: 
 
ng: File C:\Users\admin\AppData\Roaming\npm\ng.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.

## 1.2 Solution
This error occurs when your system has disabled the running script and your system is can’t accept the ng commands. This error occurs due to security reasons and won't let the script be executed on your system without your approval. Then you have to open the PowerShell with administrative rights.
 
To solve this problem, you need to follow a few steps:
1. First, you have to need to open the command prompt and run this command.
`set-ExecutionPolicy RemoteSigned -Scope CurrentUser `
![](https://csharpcorner-mindcrackerinc.netdna-ssl.com/article/how-to-fix-ps1-can-not-be-loaded-because-running-scripts-is-disabled-on-this-sys/Images/Capture.PNG)
2. Now you have to run the second command on your system. This command is:`Get-ExecutionPolicy`
![](https://csharpcorner-mindcrackerinc.netdna-ssl.com/article/how-to-fix-ps1-can-not-be-loaded-because-running-scripts-is-disabled-on-this-sys/Images/get1.PNG)

3. To view their policy, you need to run this command in your command prompt:`Get-ExecutionPolicy -list`
![](https://csharpcorner-mindcrackerinc.netdna-ssl.com/article/how-to-fix-ps1-can-not-be-loaded-because-running-scripts-is-disabled-on-this-sys/Images/get2.PNG)

You can see that the ng command has been run successfully. Now my problem is solved.  

# 2. 'Set-ExecutionPolicy' is not recognized as an internal or external command
使用PowerShell执行`set-ExecutionPolicy RemoteSigned -Scope CurrentUser `

# 3. No pipe found with name 'translate'. 
{{ 'search' | translate }}
解决方式
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
删掉forRoot
# 4. ERROR NullInjectorError: R3InjectorError(AppModule)[TranslateService -> TranslateService -> TranslateService]: 
NullInjectorError: No provider for TranslateService!

解决：
StoreModule.forRoot should only be called once in the root of your project NgModule. If you wan’t to register a feature, use StoreModule.forFeature. Using forRoot registers the global providers needed for Store.
TranslateModule.forRoot({}),

```ts
    // 调用forRoot静态方法指定加载的文件
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
```

# 5. Angular报错问题：Can't bind to 'formGroup' since it isn't a known property of 'form'
报错提示：
```
Uncaught Error: Template parse errors:
Can't bind to 'formGroup' since it isn't a known property of 'form'. ("</p>
<form [ERROR ->][formGroup]="loginForm">
  <label>
"): ng:///AppModule/LoginComponent.html@7:6
```
问题原因：
没有导入表单模块 FormsModule。

解决办法:
从 @angular/forms 中导入 ReactiveFormsModule 模块。

`import { FormsModule, ReactiveFormsModule } from '@angular/forms'`;

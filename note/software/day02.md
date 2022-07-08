Vscode
ctrl+`：打开终端Terminal
ctrl+shift+P：打开搜索栏

Angular:
ng new my-first-project
cd my-first-project
ng serve

Windows:
shift+win+s：截图

# 9 TypeScript 函数
1. 函数定义：function name（参数）{//函数体}
2. 调用函数：name（）
3. 返回值：
	function name（参数）：期望的返回值类型{//函数体 return 返回值}
4. 参数
	```typescript
	function func_name( param1 [:datatype], param2 [:datatype]){   
	
	//函数体
	}
	function add(x: number, y: number): number {
    return x + y;
	}
	console.log(add(1,2))
	```
5. 可选参数和默认参数【可选参数必须跟在必需参数后面】
	```typescript
	function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
	}
 
	let result1 = buildName("Bob");  // 正确
	let result2 = buildName("Bob", "Adams", "Sr.");  // 错误，参数太多了
	let result3 = buildName("Bob", "Adams");  // 正确
	```
6. 默认参数
	```typescript
	function function_name(param1[:type],param2[:type] = default_value) { 
	
	}
	function calculate_discount(price:number,rate:number = 0.50) { 
    var discount = price * rate; 
    console.log("计算结果: ",discount); 
	} 
	calculate_discount(1000) 
	calculate_discount(1000,0.30)
	```
7. 剩余参数
	
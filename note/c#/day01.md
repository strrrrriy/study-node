# 1. 类型系统
* C 和 C++ 开发人员请注意，在 C# 中，bool 不能转换为 int。

在 C# 中，变量分为以下几种类型：

> 值类型（Value types）

> 引用类型（Reference types）

> 指针类型（Pointer types）
## 1.1 在变量声明中指定类型
当在程序中声明变量或常量时，必须指定其类型或使用 var 关键字让编译器推断类型。
```c#
// Declaration only:
float temperature;
string name;
MyClass myClass;

// Declaration with initializers (four examples):
char firstLetter = 'C';
var limit = 3;
int[] source = { 0, 1, 2, 3, 4, 5 };
var query = from item in source
            where item <= limit
            select item;
```
声明变量后，不能使用新类型重新声明该变量，并且不能分配与其声明的类型不兼容的值
## 1.2 内置类型
这些类型表示整数、浮点值、布尔表达式、文本字符、十进制值和其他数据类型。
还有内置的 string 和 object 类型。 这些类型可供在任何 C# 程序中使用。

## 1.3 自定义类型
可以使用 struct、class、interface、enum 和 record 构造来创建自己的自定义类型。

## 1.4 通用类型系统
1. 它支持继承原则。 
类型可以派生自其他类型（称为基类型）。 派生类型继承（有一些限制）基类型的方法、属性和其他成员。
所有类型（包括 System.Int32 (C# keyword: int) 等内置数值类型）最终都派生自单个基类型，即 System.Object (C# keyword: object)。 
这样的统一类型层次结构称为通用类型系统 (CTS)

2. CTS 中的每种类型被定义为值类型或引用类型。

## 1.5 值类型-派生自System.ValueType（派生自 System.Object）
值类型变量直接包含其值。 
*结构的内存在声明变量的任何上下文中进行内联分配。 
对于值类型变量，没有单独的堆分配或垃圾回收开销。*
可以声明属于值类型的 record struct 类型，并包括记录的合成成员。

* 值类型分为两类：struct和enum。
内置的数值类型是结构，它们具有可访问的字段和方法：
```c#
// constant field on type byte.
byte b = byte.MaxValue;
//但可将这些类型视为简单的非聚合类型，为其声明并赋值：
byte num = 0xA;
int i = 5;
char c = 'Z';
```

1. struct
```c#
public struct Coords
{
    public int x, y;
    public Coords(int p1, int p2)
    {
        x = p1;
        y = p2;
    }
}
```

2. enum。 枚举定义的是一组已命名的整型常量。
```c#
public enum FileMode
{
    CreateNew = 1,
    Create = 2,
    Open = 3,
    OpenOrCreate = 4,
    Truncate = 5,
    Append = 6,
}
```

## 1.6 引用类型

定义为 class、record、delegate、数组或 interface 的类型是 reference type。
它将包含值 null，直到你将其分配给该类型的实例，或者使用 new 运算符创建一个。 

* 无法使用 new 运算符直接实例化 interface。 而是创建并分配实现接口的类实例。

创建对象时，会在托管堆上分配内存。 
变量只保留对对象位置的引用。 
对于托管堆上的类型，在分配内存和回收内存时都会产“垃圾回收”是 CLR 的自动内存管理功能，用于执行回收。 
但是，垃圾回收已是高度优化，并且在大多数情况下，不会产生性能问题。 

* 所有数组都是引用类型，即使元素是值类型，也不例外。 数组隐式派生自 System.Array 类。
```c#
// Declare and initialize an array of integers.
int[] nums = { 1, 2, 3, 4, 5 };

// Access an instance property of System.Array.
int len = nums.Length;
```

## 1.7 文本值的类型

## 1.8 泛型类型
可使用一个或多个类型参数声明的类型，用作实际类型（具体类型）的占位符 。 
客户端代码在创建类型实例时提供具体类型。 这种类型称为泛型类型。 
```c#
List<string> stringList = new List<string>();
stringList.Add("String example");
// compile time error adding a type other than a string:
stringList.Add(4);
```
通过使用类型参数，可重新使用相同类以保存任意类型的元素，且无需将每个元素转换为对象。 
泛型集合类称为强类型集合，因为编译器知道集合元素的具体类型，并能在编译时引发错误，
例如当尝试向上面示例中的 stringList 对象添加整数时。

## 1.9 隐式类型、匿名类型和可以为 null 的值类型
1. 你可以使用 var 关键字隐式键入一个局部变量（但不是类成员）。 变量仍可在编译时获取类型，但类型是由编译器提供。
2. 不方便为不打算存储或传递外部方法边界的简单相关值集合创建命名类型。 因此，可以创建匿名类型。
3. 普通值类型不能具有 null 值。 不过，可以在类型后面追加 ?，创建可为空的值类型。 例如，int? 是还可以包含值 null 的 int 类型。 可以为 null 的值类型是泛型结构类型 System.Nullable<T> 的实例。 
在将数据传入和传出数据库（数值可能为 null）时，可为空的值类型特别有用。
## 1.10 编译时类型和运行时类型
编译时类型是源代码中变量的声明或推断类型。 

运行时类型是该变量所引用的实例的类型。
这两种类型通常是相同的
```c#
string message = "This is a string of characters";

//运行时类型为 string。 编译时类型在第一行中为 object，在第二行中为 IEnumerable<char>。
object anotherMessage = "This is another string of characters";
IEnumerable<char> someCharacters = "abcdefghijklmnopqrstuvwxyz";
```

# 2. 声明命名空间来整理类型
在 C# 编程中，命名空间在两个方面被大量使用。 首先，.NET 使用命名空间来组织它的许多类，如下所示：

```c#

System.Console.WriteLine("Hello World!");
//System 是一个命名空间，Console 是该命名空间中的一个类。 可使用 using 关键字，这样就不必使用完整的名称，如下例所示：

using System;
Console.WriteLine("Hello World!");
```

从 C# 10 开始，可以为该文件中定义的所有类型声明一个命名空间，如以下示例所示：
```c#
namespace SampleNamespace;

class AnotherSampleClass
{
    public void AnotherSampleMethod()
    {
        System.Console.WriteLine(
            "SampleMethod inside SampleNamespace");
    }
}
```

## 2.1 命名空间概述
命名空间具有以下属性：

1. 它们组织大型代码项目。
2. 通过使用 . 运算符分隔它们。
3. using 指令可免去为每个类指定命名空间的名称。
4. global 命名空间是“根”命名空间：global::System 始终引用 .NET System 命名空间。

## 2.2 C# 语言规范


# 3. 类简介-引用类型
```c#
public class Person
{
    // Constructor that takes no arguments:
    public Person()
    {
        Name = "unknown";
    }

    // Constructor that takes one argument:
    public Person(string name)
    {
        Name = name;
    }

    // Auto-implemented readonly property:
    public string Name { get; }

    // Method that overrides the base class (System.Object) implementation.
    public override string ToString()
    {
        return Name;
    }
}
class TestPerson
{
    static void Main()
    {
        // Call the constructor that has no parameters.
        var person1 = new Person();
        Console.WriteLine(person1.Name);

        // Call the constructor that has one parameter.
        var person2 = new Person("Sarah Jones");
        Console.WriteLine(person2.Name);
        // Get the string representation of the person2 instance.
        Console.WriteLine(person2);
    }
}
// Output:
// unknown
// Sarah Jones
// Sarah Jones
```

# 4. C# 中的记录类型简介
## 4.1 何时使用记录

1. 你想要定义依赖值相等性的数据模型。
2. 你想要定义对象不可变的类型。

### 4.1.1 值相等性
对记录来说，值相等性表示当类型匹配且所有属性和字段值都匹配时，记录类型的两个变量相等。 
对于其他引用类型（例如类），相等性是指引用相等性。 
也就是说，如果类的两个变量引用同一个对象，则这两个变量是相等的。 
确定两个记录实例的相等性的方法和运算符使用值相等性。

### 4.1.2 不可变性
不可变类型会阻止你在对象实例化后更改该对象的任何属性或字段值。 
如果你需要一个类型是线程安全的，或者需要哈希代码在哈希表中国能保持不变，那么不可变性很有用。 
记录为创建和使用不可变类型提供了简洁的语法。

## 4.2 记录与类和结构的区别
声明和实例化类或结构时使用的语法与操作记录时的相同。 
只是将 class 关键字替换为 record，或者使用 record struct 而不是 struct。 
同样地，记录类支持相同的表示继承关系的语法。 记录与类的区别如下所示：

1. 可使用位置参数创建和实例化具有不可变属性的类型
2. 在类中指示引用相等性或不相等的方法和运算符（例如 Object.Equals(Object) 和 ==）在记录中指示Object.Equals(Object)
3. 可使用 表达式对不可变对象创建在所选属性中具有新值的副本
4. 记录的 ToString 方法会创建一个格式字符串，它显示对象的类型名称及其所有公共属性的名称和值
5. 记录可从另一个记录继承。 但记录不可从类继承，类也不可从记录继承
记录结构与结构的不同之处是，编译器合成了方法来确定相等性和 ToString。 编译器为位置记录结构合成 Deconstruct 方法。

```c#
public record Person(string FirstName, string LastName);

public static void Main()
{
    Person person = new("Nancy", "Davolio");
    Console.WriteLine(person);
    // output: Person { FirstName = Nancy, LastName = Davolio }
}
//==================================================
public record Person(string FirstName, string LastName, string[] PhoneNumbers);

public static void Main()
{
    var phoneNumbers = new string[2];
    Person person1 = new("Nancy", "Davolio", phoneNumbers);
    Person person2 = new("Nancy", "Davolio", phoneNumbers);
    Console.WriteLine(person1 == person2); // output: True
    //可使用 表达式对不可变对象创建在所选属性中具有新值的副本
    person1.PhoneNumbers[0] = "555-1234";
    Console.WriteLine(person1 == person2); // output: True

    Console.WriteLine(ReferenceEquals(person1, person2)); // output: False
}
//=======================================================

public record Person(string FirstName, string LastName)
{
    public string[] PhoneNumbers { get; init; }
}

public static void Main()
{
    Person person1 = new("Nancy", "Davolio") { PhoneNumbers = new string[1] };
    Console.WriteLine(person1);
    // output: Person { FirstName = Nancy, LastName = Davolio, PhoneNumbers = System.String[] }

    Person person2 = person1 with { FirstName = "John" };
    Console.WriteLine(person2);
    // output: Person { FirstName = John, LastName = Davolio, PhoneNumbers = System.String[] }
    Console.WriteLine(person1 == person2); // output: False

    person2 = person1 with { PhoneNumbers = new string[1] };
    Console.WriteLine(person2);
    // output: Person { FirstName = Nancy, LastName = Davolio, PhoneNumbers = System.String[] }
    Console.WriteLine(person1 == person2); // output: False

    person2 = person1 with { };
    Console.WriteLine(person1 == person2); // output: True
}
```

# 5. 接口 - 定义多种类型的行为 ( 接口名称以大写字母 I 开头 )
接口包含非抽象 class 或 struct 必须实现的一组相关功能的定义。 
接口可以定义 static 方法，此类方法必须具有实现。 
从 C# 8.0 开始，接口可为成员定义默认实现。 接口不能声明实例数据，如字段、自动实现的属性或类似属性的事件。

例如，使用接口可以在类中包括来自多个源的行为。 
该功能在 C# 中十分重要，因为该语言不支持类的多重继承。 
此外，如果要模拟结构的继承，也必须使用接口，因为它们无法实际从另一个结构或类继承。

```c#
interface IEquatable<T>
{
    bool Equals(T obj);
}

public class Car : IEquatable<Car>
{
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? Year { get; set; }
    //实现类 Car 必须提供 Equals 方法的实现。
    // Implementation of IEquatable<T> interface
    public bool Equals(Car? car)
    {
        return (this.Make, this.Model, this.Year) ==
            (car?.Make, car?.Model, car?.Year);
    }
}
```
* 接口可以包含实例方法、属性、事件、索引器或这四种成员类型的任意组合
* 接口可以包含静态构造函数、字段、常量或运算符。
* 接口不能包含实例字段、实例构造函数或终结器。 
接口成员默认是公共的，可以显式指定可访问性修饰符（如 public、protected、internal、private、protected internal 或 private protected）。 
private 成员必须有默认实现。
* 若要实现接口成员，实现类的对应成员必须是公共、非静态，并且具有与接口成员相同的名称和签名。
* 当接口声明静态成员时，实现该接口的类型也可能声明具有相同签名的静态成员。 它们由声明成员的类型进行唯一标识。 在类型中声明的静态成员 不会 覆盖接口中声明的静态成员。


> 接口可从一个或多个接口继承。 
派生接口从其基接口继承成员。 
实现派生接口的类必须实现派生接口中的所有成员，包括派生接口的基接口的所有成员。 
该类可能会隐式转换为派生接口或任何其基接口。 类可能通过它继承的基类或通过其他接口继承的接口来多次包含某个接口。
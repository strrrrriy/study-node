# 1. 泛型类和方法
可设计具有以下特征的类和方法：在客户端代码声明并初始化这些类或方法之前，这些类或方法会延迟指定一个或多个类型。
例如，通过使用泛型类型参数 T，可以编写其他客户端代码能够使用的单个类，而不会产生运行时转换或装箱操作的成本或风险

```c#
// Declare the generic class.
public class GenericList<T>
{
    public void Add(T input) { }
}
class TestGenericList
{
    private class ExampleClass { }
    static void Main()
    {
        // Declare a list of type int.
        GenericList<int> list1 = new GenericList<int>();
        list1.Add(1);

        // Declare a list of type string.
        GenericList<string> list2 = new GenericList<string>();
        list2.Add("");

        // Declare a list of type ExampleClass.
        GenericList<ExampleClass> list3 = new GenericList<ExampleClass>();
        list3.Add(new ExampleClass());
    }
}
```
## 1.1 创建自定义泛型类型和泛型方法
创建自定义泛型类型和泛型方法，以提供自己的通用解决方案，设计类型安全的高效模式。 以下代码示例演示了出于演示目的的简单泛型链接列表类。 （大多数情况下，应使用 .NET 提供的 List<T> 类，而不是自行创建类。）

* 在通常使用具体类型来指示列表中所存储项的类型的情况下，可使用类型参数 T。 其使用方法如下：

1. 在 AddHead 方法中作为方法参数的类型。
2. 在 Node 嵌套类中作为 Data 属性的返回类型。
3. 在嵌套类中作为私有成员 data 的类型。

T 可用于 Node 嵌套类。 如果使用具体类型实例化 GenericList<T>（例如，作为 GenericList<int>），则出现的所有 T 都将替换为 int。
```c#
// type parameter T in angle brackets
public class GenericList<T>
{
    // The nested class is also generic on T.
    private class Node
    {
        // T used in non-generic constructor.
        public Node(T t)
        {
            next = null;
            data = t;
        }

        private Node? next;
        public Node? Next
        {
            get { return next; }
            set { next = value; }
        }

        // T as private member data type.
        private T data;

        // T as return type of property.
        public T Data
        {
            get { return data; }
            set { data = value; }
        }
    }

    private Node? head;

    // constructor
    public GenericList()
    {
        head = null;
    }

    // T as method parameter type:
    public void AddHead(T t)
    {
        Node n = new Node(t);
        n.Next = head;
        head = n;
    }

    public IEnumerator<T> GetEnumerator()
    {
        Node? current = head;

        while (current != null)
        {
            yield return current.Data;
            current = current.Next;
        }
    }
}


class TestGenericList
{
    static void Main()
    {
        // int is the type argument
        GenericList<int> list = new GenericList<int>();

        for (int x = 0; x < 10; x++)
        {
            list.AddHead(x);
        }

        foreach (int i in list)
        {
            System.Console.Write(i + " ");
        }
        System.Console.WriteLine("\nDone");
    }
}
```

# 2. 匿名类型

1. 匿名类型提供了一种方便的方法，可用来将一组只读属性封装到单个对象中，而无需首先显式定义一个类型。 类型名由编译器生成，并且不能在源代码级使用。 每个属性的类型由编译器推断。

```c#
var v = new { Amount = 108, Message = "Hello" };

// Rest the mouse pointer over v.Amount and v.Message in the following
// statement to verify that their inferred types are int and string.
Console.WriteLine(v.Amount + v.Message);
```

2. 匿名类型包含一个或多个公共只读属性。 包含其他种类的类成员（如方法或事件）为无效。 用来初始化属性的表达式不能为 null、匿名函数或指针类型。

```c#
//最常见的方案是用其他类型的属性初始化匿名类型。 在下面的示例中，假定名为 Product 的类存在。 类 Product 包括 Color 和 Price 属性，以及你不感兴趣的其他属性。 变量 Productproducts 是 对象的集合。 匿名类型声明以 new 关键字开始。 声明初始化了一个只使用 Product 的两个属性的新类型。 使用匿名类型会导致在查询中返回的数据量变少。
var productQuery =
    from prod in products
    select new { prod.Color, prod.Price };

foreach (var v in productQuery)
{
    Console.WriteLine("Color={0}, Price={1}", v.Color, v.Price);
}
```
3. 如果未在匿名类型中指定成员名称，编译器会为匿名类型成员提供与用于初始化它们的属性相同的名称。 为使用表达式初始化的属性提供名称，如上一示例中所示。 在下面示例中，匿名类型的属性名称都为 PriceColor 和 。


4. 当使用匿名类型来初始化变量时，可以通过使用 var 将变量作为隐式键入的本地变量来进行声明。 类型名称无法在变量声明中给出，因为只有编译器能访问匿名类型的基础名称。

```c#
//匿名类型是 class 类型，它们直接派生自 object，并且无法强制转换为除 object 外的任何类型。 虽然你的应用程序不能访问它，编译器还是提供了每一个匿名类型的名称。 从公共语言运行时的角度来看，匿名类型与任何其他引用类型没有什么不同。
var anonArray = new[] { new { name = "apple", diam = 4 }, new { name = "grape", diam = 1 }};
```
5. 匿名类型支持采用 with 表达式形式的非破坏性修改。 这使你能够创建匿名类型的新实例，其中一个或多个属性具有新值

```c#
var apple = new { Item = "apples", Price = 1.35 };
var onSale = apple with { Price = 0.79 };
Console.WriteLine(apple);
Console.WriteLine(onSale);
```

无法将字段、属性、时间或方法的返回类型声明为具有匿名类型。 同样，你不能将方法、属性、构造函数或索引器的形参声明为具有匿名类型。 要将匿名类型或包含匿名类型的集合作为参数传递给某一方法，可将参数作为类型 object 进行声明。 但是，对匿名类型使用 object 违背了强类型的目的。 如果必须存储查询结果或者必须将查询结果传递到方法边界外部，请考虑使用普通的命名结构或类而不是匿名类型。

6. 由于匿名类型上的 Equals 和 GetHashCode 方法是根据方法属性的 Equals 和 GetHashCode 定义的，因此仅当同一匿名类型的两个实例的所有属性都相等时，这两个实例才相等。

# 3. C# 中的类、结构和记录概述

## 3.1 封装

## 3.2 成员

* C# 没有全局变量或方法，这一点其他某些语言不同。 即使是编程的入口点（Main 方法），也必须在类或结构中声明（使用顶级语句时，隐式声明）。

下面列出了所有可以在类、结构或记录中声明的各种成员。
> 字段
常量
属性
方法
构造函数
事件
终结器
索引器
运算符
嵌套类型
## 3.3 可访问性-默认值为 private
一些方法和属性可供类或结构外部的代码（称为“客户端代码”）调用或访问。 另一些方法和属性只能在类或结构本身中使用。
* public
* protected
* internal
* protected internal
* private
* private protected。
## 3.4 继承
派生自另一个类（称为基类）的类自动包含基类的所有公共、受保护和内部成员（其构造函数和终结器除外）。

可以将类声明为 abstract，即一个或多个方法没有实现代码。 尽管抽象类无法直接实例化，但可以作为提供缺少实现代码的其他类的基类。 类还可以声明为 sealed，以阻止其他类继承。

## 3.5 界面*
类、结构和记录可以实现多个接口。 从接口实现意味着类型实现接口中定义的所有方法。

## 3.6 泛型类型
类、结构和记录可以使用一个或多个类型参数进行定义。 客户端代码在创建类型实例时提供类型

## 3.7 静态类型
类（而非结构或记录）可以声明为static。 静态类只能包含静态成员，不能使用 new 关键字进行实例化。在程序加载时，类的一个副本会加载到内存中，而其成员则可通过类名进行访问。 类、结构和记录可以包含静态成员。 

## 3.8 嵌套类型
类、结构和记录可以嵌套在其他类、结构和记录中。 有关详细信息，请参阅嵌套类型。

## 3.9 分部类型*
可以在一个代码文件中定义类、结构或方法的一部分，并在其他代码文件中定义另一部分。 

## 3.10 对象初始值设定项*
可以通过将值分配给属性来实例化和初始化类或结构对象以及对象集合。

## 3.11 匿名类型
在不方便或不需要创建命名类的情况下，可以使用匿名类型。 匿名类型由其命名数据成员定义。

## 3.12 扩展方法*
可以通过创建单独的类型来“扩展”类，而无需创建派生类。 该类型包含可以调用的方法，就像它们属于原始类型一样。 

## 3.13 隐式类型的局部变量*
在类或结构方法中，可以使用隐式类型指示编译器在编译时确定变量类型。

## 3.14 记录
C# 9 引入了 record 类型，可创建此引用类型而不创建类或结构。 记录是带有内置行为的类，用于将数据封装在不可变类型中。

# 4. 对象 - 创建类型的实例
类或结构定义的作用类似于蓝图，指定该类型可以进行哪些操作。 从本质上说，对象是按照此蓝图分配和配置的内存块。 程序可以创建同一个类的多个对象。 对象也称为实例，可以存储在命名变量中，也可以存储在数组或集合中。 使用这些变量来调用对象方法及访问对象公共属性的代码称为客户端代码。 

* 公共语言运行时中高度优化了托管堆上内存的分配和释放。 在大多数情况下，在堆上分配类实例与在堆栈上分配结构实例在性能成本上没有显著的差别。
## 4.1 对象标识与值相等性
在比较两个对象是否相等时，首先必须明确是想知道两个变量是否表示内存中的同一对象，还是想知道这两个对象的一个或多个字段的值是否相等。 如果要对值进行比较，则必须考虑这两个对象是值类型（结构）的实例，还是引用类型（类、委托、数组）的实例。
1. 若要确定两个类实例是否引用内存中的同一位置（这意味着它们具有相同的标识），可使用静态==方法。 （System.Object 是所有值类型和引用类型的隐式基类，其中包括用户定义的结构和类。）


2. 若要确定两个结构实例中的实例字段是否具有相同的值，可使用 ValueType.Equals 方法。 由于所有结构都隐式继承自 System.ValueType，因此可以直接在对象上调用该方法，如以下示例所示：
```c#
// Person is defined in the previous example.

//public struct Person
//{
//    public string Name;
//    public int Age;
//    public Person(string name, int age)
//    {
//        Name = name;
//        Age = age;
//    }
//}

Person p1 = new Person("Wallace", 75);
Person p2 = new Person("", 42);
p2.Name = "Wallace";
p2.Age = 75;
//Equals 的 System.ValueType 实现在某些情况下使用装箱和反射。
if (p2.Equals(p1))
    Console.WriteLine("p2 and p1 have the same values.");

// Output: p2 and p1 have the same values.
```

3. 若要确定两个类实例中字段的值是否相等，可以使用 Equals 方法或 Equals。 但是，只有类通过重写或重载提供关于那种类型对象的“相等”含义的自定义时，才能使用它们。 类也可能实现 IEquatable<T> 接口或 IEqualityComparer<T> 接口。 这两个接口都提供可用于测试值相等性的方法。 设计好替代 Equals 的类后，请务必遵循Equals和 Object.Equals(Object) 中介绍的准则。

# 5. 继承 - 派生用于创建更具体的行为的类型
继承（以及封装和多态性）是面向对象的编程的三个主要特征之一。 通过继承，可以创建新类，以便重用、扩展和修改在其他类中定义的行为。 其成员被继承的类称为“基类”，继承这些成员的类称为“派生类”。 派生类只能有一个直接基类。 但是，继承是可传递的。
* 结构不支持继承，但它们可以实现接口。

## 5.1 抽象方法和虚方法
基类将方法声明为 virtual 时，派生类可以使用其自己的实现override该方法。 如果基类将成员声明为 abstract，则必须在直接继承自该类的任何非抽象类中重写该方法。 如果派生类本身是抽象的，则它会继承抽象成员而不会实现它们。 抽象和虚拟成员是多态性（面向对象的编程的第二个主要特征）的基础。 

## 5.2 抽象基类
如果要通过使用 new 运算符来防止直接实例化，则可以将类声明为抽象。 只有当一个新类派生自该类时，才能使用抽象类。 抽象类可以包含一个或多个本身声明为抽象的方法签名。 这些签名指定参数和返回值，但没有任何实现（方法体）。 抽象类不必包含抽象成员；但是，如果类包含抽象成员，则类本身必须声明为抽象。 本身不抽象的派生类必须为来自抽象基类的任何抽象方法提供实现。
## 5.3 接口
接口是定义一组成员的引用类型。 实现该接口的所有类和结构都必须实现这组成员。 接口可以为其中任何成员或全部成员定义默认实现。 类可以实现多个接口，即使它只能派生自单个直接基类。

## 5.4 防止进一步派生
类可以通过将自己或成员声明为 sealed，来防止其他类继承自它或继承自其任何成员。

## 5.5 基类成员的派生类隐藏

派生类可以通过使用相同名称和签名声明成员来隐藏基类成员。 new 修饰符可以用于显式指示成员不应作为基类成员的重写。 使用 new 不是必需的，但如果未使用 new，则会产生编译器警告。

# 6. 多态
多态性具有两个截然不同的方面：
1. 在运行时，在方法参数和集合或数组等位置，派生类的对象可以作为基类的对象处理。 在出现此多形性时，该对象的声明类型不再与运行时类型相同
2. 基类可以定义并实现虚方法，派生类可以重写这些方法，即派生类提供自己的定义和实现。 在运行时，客户端代码调用该方法，CLR 查找对象的运行时类型，并调用虚方法的重写方法。 你可以在源代码中调用基类的方法，执行该方法的派生类版本。


## 6.1 例子
虚方法允许你以统一方式处理多组相关的对象。 例如，假定你有一个绘图应用程序，允许用户在绘图图面上创建各种形状。 你在编译时不知道用户将创建哪些特定类型的形状。 但应用程序必须跟踪创建的所有类型的形状，并且必须更新这些形状以响应用户鼠标操作。 你可以使用多态性通过两个基本步骤解决这一问题：
1. 创建一个类层次结构，其中每个特定形状类均派生自一个公共基类
2. 使用虚方法通过对基类方法的单个调用来调用任何派生类上的相应方法
```c#
public class Shape
{
    // A few example members
    public int X { get; private set; }
    public int Y { get; private set; }
    public int Height { get; set; }
    public int Width { get; set; }

    // Virtual method
    public virtual void Draw()
    {
        Console.WriteLine("Performing base class drawing tasks");
    }
}

public class Circle : Shape
{
    public override void Draw()
    {
        // Code to draw a circle...
        Console.WriteLine("Drawing a circle");
        base.Draw();
    }
}
public class Rectangle : Shape
{
    public override void Draw()
    {
        // Code to draw a rectangle...
        Console.WriteLine("Drawing a rectangle");
        base.Draw();
    }
}
public class Triangle : Shape
{
    public override void Draw()
    {
        // Code to draw a triangle...
        Console.WriteLine("Drawing a triangle");
        base.Draw();
    }
}
//若要更新绘图图面，请使用 foreach 循环对该列表进行循环访问，并对其中的每个 Shape 对象调用 方法。 虽然列表中的每个对象都具有声明类型 Shape，但调用的将是运行时类型（该方法在每个派生类中的重写版本）。
// Polymorphism at work #1: a Rectangle, Triangle and Circle
// can all be used whereever a Shape is expected. No cast is
// required because an implicit conversion exists from a derived
// class to its base class.
var shapes = new List<Shape>
{
    new Rectangle(),
    new Triangle(),
    new Circle()
};

// Polymorphism at work #2: the virtual method Draw is
// invoked on each of the derived classes, not the base class.
foreach (var shape in shapes)
{
    shape.Draw();
}
/* Output:
    Drawing a rectangle
    Performing base class drawing tasks
    Drawing a triangle
    Performing base class drawing tasks
    Drawing a circle
    Performing base class drawing tasks
*/
```

## 6.2 多态性概述
### 6.2.1 虚拟成员

当派生类从基类继承时，它会获得基类的所有方法、字段、属性和事件。 派生类的设计器可以针对虚拟方法的行为做出不同的选择：

1. 派生类可以重写基类中的虚拟成员，并定义新行为。
2. 派生类可能会继承最接近的基类方法而不重写方法，同时保留现有的行为，但允许进一步派生的类重写方法。
3. 派生类可以定义隐藏基类实现的成员的新非虚实现。
仅当基类成员声明为 virtual 或 abstract 时，派生类才能重写基类成员。 派生成员必须使用 override 关键字显式指示该方法将参与虚调用。 
```c#
public class BaseClass
{
    public virtual void DoWork() { }
    public virtual int WorkProperty
    {
        get { return 0; }
    }
}
public class DerivedClass : BaseClass
{
    public override void DoWork() { }
    public override int WorkProperty
    {
        get { return 0; }
    }
}
//字段不能是虚拟的，只有方法、属性、事件和索引器才可以是虚拟的。 当派生类重写某个虚拟成员时，即使该派生类的实例被当作基类的实例访问，也会调用该成员。 
DerivedClass B = new DerivedClass();
B.DoWork();  // Calls the new method.

BaseClass A = B;
A.DoWork();  // Also calls the new method.
```
## 6.2.2 使用新成员隐藏基类成员
如果希望派生类具有与基类中的成员同名的成员，则可以使用 new 关键字隐藏基类成员。 new 关键字放置在要替换的类成员的返回类型之前。 以下代码提供了一个示例
```c#
public class BaseClass
{
    public void DoWork() { WorkField++; }
    public int WorkField;
    public int WorkProperty
    {
        get { return 0; }
    }
}

public class DerivedClass : BaseClass
{
    public new void DoWork() { WorkField++; }
    public new int WorkField;
    public new int WorkProperty
    {
        get { return 0; }
    }
}
//通过将派生类的实例强制转换为基类的实例，可以从客户端代码访问隐藏的基类成员。
DerivedClass B = new DerivedClass();
B.DoWork();  // Calls the new method.

BaseClass A = (BaseClass)B;
A.DoWork();  // Calls the old method.
```
## 6.2.3 阻止派生类重写虚拟成员
无论在虚拟成员和最初声明虚拟成员的类之间已声明了多少个类，虚拟成员都是虚拟的。 如果类 A 声明了一个虚拟成员，类 B 从 A 派生，类 C 从类 B 派生，则不管类 B 是否为虚拟成员声明了重写，类 C 都会继承该虚拟成员，并可以重写它。
* 派生类可以通过将重写声明为 sealed 来停止虚拟继承。
* 通过使用 new 关键字，密封的方法可以由派生类替换
```c#
public class A
{
    public virtual void DoWork() { }
}
public class B : A
{
    public override void DoWork() { }
}

//派生类可以通过将重写声明为 sealed 来停止虚拟继承。 停止继承需要在类成员声明中的 override 关键字前面放置 sealed 关键字。
public class C : B
{
    public sealed override void DoWork() { }
}
//方法 DoWork 对从 C 派生的任何类都不再是虚拟方法。 即使它们转换为类型 B 或类型 A，它对于 C 的实例仍然是虚拟的。

// 通过使用 new 关键字，密封的方法可以由派生类替换
public class D : C
{
    public new void DoWork() { }
}
//如果使用类型为 C、B 或 A 的变量访问 D 的实例，对 DoWork 的调用将遵循虚拟继承的规则，即把这些调用传送到类 C 的 DoWork 实现
```

## 6.2.4 从派生类访问基类虚拟成员
已替换或重写某个方法或属性的派生类仍然可以使用 base 关键字访问基类的该方法或属性。
```c#
public class Base
{
    public virtual void DoWork() {/*...*/ }
}
public class Derived : Base
{
    public override void DoWork()
    {
        //Perform Derived's work here
        //...
        // Call DoWork on base class
        base.DoWork();
    }
}
```
建议虚拟成员在它们自己的实现中使用 base 来调用该成员的基类实现。 允许基类行为发生使得派生类能够集中精力实现特定于派生类的行为。 未调用基类实现时，由派生类负责使它们的行为与基类的行为兼容。

# 7. 模式匹配概述
“模式匹配”是一种测试表达式是否具有特定特征的方法。 C# 模式匹配提供更简洁的语法，用于测试表达式并在表达式匹配时采取措施。 “is 表达式”目前支持通过模式匹配测试表达式并有条件地声明该表达式结果。 “switch 表达式”允许你根据表达式的首次匹配模式执行操作。 这两个表达式支持丰富的模式词汇。

## 7.1 Null 检查
模式匹配最常见的方案之一是确保值不是 null。 使用以下示例进行 null 测试时，可以测试可为 null 的值类型并将其转换为其基础类型
```c#
// int ? 是 System.Nullable<int>的缩写。

//int ? 和 int 类型是不一样的，运算时需要进行显示转换，但如果op1为null，会生成System.InvalidOperationException类型的异常
int ? op1 = 5;
int result = (int)op1 * 2;
//?? 运算符：空接合运算符：一个二元运算符，允许给可能等于 null 的表达式提供另一个值
//如果第一个操作数不是 null，该运算符就等于第一个操作数， 否则，该运算符就等于第二个操作数。
//以下两个表达式的作用相同的： op1 可以是任意可空表达式
op1 ?? op2 
op1 == null ? op2 : op1 
//?.运算符：Elvis 运算符或空条件运算符
//如果想得到给定客户的订单数，就需要在设置计数值之前检查空值：
int count = 0;
 
if(customer.order ! = null)
{
  count = customer.orders.Count();
}
//如果客户没有订单(即为 null)，使用?.运算符，会把 int? count 设置为 null， 而不是抛出一个异常：
int ? count = customer.orders?.Count();

//可在结果是 null 时设置一默认值：
int ? count = costumer.orders?.Count() ?? 0; 
//==============================================================
//声明模式
//语言规则使此方法比其他方法更安全。 变量 number 仅在 if 子句的 true 部分可供访问和分配。
//变量 number 仅在 if 子句的 true 部分可供访问和分配。 如果尝试在 else 子句或 if 程序块后等其他位置访问，编译器将出错。
int? maybe = 12;
if (maybe is int number)
{
    Console.WriteLine($"The nullable int 'maybe' has the value {number}");
}
else
{
    Console.WriteLine("The nullable int 'maybe' doesn't hold a value");
}
//逻辑模式：在否定模式不匹配时与该模式匹配。
//由于不使用 == 运算符，因此当类型重载 == 运算符时，此模式有效。 这使该方法成为检查空引用值的理想方法，可以添加 not 模式：
string? message = "This is not the null string";

if (message is not null)
{
    Console.WriteLine(message);
}
```
## 7.2 类型测试
模式匹配的另一种常见用途是测试变量是否与给定类型匹配。 
```c#
//以下代码测试变量是否为非 null 并实现 System.Collections.Generic.IList<T> 接口。 如果是，它将使用该列表中的 ICollection<T>.Count 属性来查找中间索引。 不管变量的编译时类型如何，声明模式均与 null 值不匹配。 除了防范未实现 IList 的类型之外，以下代码还可防范 null。
public static T MidPoint<T>(IEnumerable<T> sequence)
{
    if (sequence is IList<T> list)
    {
        return list[list.Count / 2];
    }
    else if (sequence is null)
    {
        throw new ArgumentNullException(nameof(sequence), "Sequence can't be null.");
    }
    else
    {
        int halfLength = sequence.Count() / 2 - 1;
        if (halfLength < 0) halfLength = 0;
        return sequence.Skip(halfLength).First();
    }
}
```

## 7.3 比较离散值
你还可以通过测试变量找到特定值的匹配项。 在以下代码演示的示例中，你针对枚举中声明的所有可能值进行数值测试：
```c#
public State PerformOperation(Operation command) =>
   command switch
   {
       Operation.SystemTest => RunDiagnostics(),
       Operation.Start => StartSystem(),
       Operation.Stop => StopSystem(),
       Operation.Reset => ResetToReady(),
       _ => throw new ArgumentException("Invalid enum value for command", nameof(command)),
   };
   //最终 _ 案例为与所有数值匹配的弃元模式。 它处理值与定义的 enum 值之一不匹配的任何错误条件。 如果省略开关臂，编译器会警告你尚未处理所有可能输入值。 在运行时，如果检查的对象与任何开关臂均不匹配，则 switch 表达式会引发异常。 可以使用数值常量代替枚举值集。

public State PerformOperation(string command) =>
   command switch
   {
       "SystemTest" => RunDiagnostics(),
       "Start" => StartSystem(),
       "Stop" => StopSystem(),
       "Reset" => ResetToReady(),
       _ => throw new ArgumentException("Invalid string value for command", nameof(command)),
   };

// 从 C# 11 开始，还可以使用或 Span<char> 测试 ReadOnlySpan<char>常量字符串值，如以下示例所示：
public State PerformOperation(ReadOnlySpan<char> command) =>
   command switch
   {
       "SystemTest" => RunDiagnostics(),
       "Start" => StartSystem(),
       "Stop" => StopSystem(),
       "Reset" => ResetToReady(),
       _ => throw new ArgumentException("Invalid string value for command", nameof(command)),
   };
```
## 7.4 关系模式
你可以使用关系模式测试如何将数值与常量进行比较。 and  or 
```c#
string WaterState(int tempInFahrenheit) =>
    tempInFahrenheit switch
    {
        (> 32) and (< 212) => "liquid",
        < 32 => "solid",
        > 212 => "gas",
        32 => "solid/liquid transition",
        212 => "liquid / gas transition",
    };
    //上述代码还说明了编译器为模式匹配表达式提供的另一项重要功能：如果没有处理每个输入值，编译器会发出警告。 如果交换机 arm 已由先前的交换机 arm 处理，则编译器还会发出警告。 这使你能够随意重构和重新排列 switch 表达式。 编写同一表达式的另一种方法是：
string WaterState2(int tempInFahrenheit) =>
    tempInFahrenheit switch
    {
        < 32 => "solid",
        32 => "solid/liquid transition",
        < 212 => "liquid",
        212 => "liquid / gas transition",
        _ => "gas",
};
```

## 7.5 多个输入
到目前为止，你所看到的所有模式都在检查一个输入。 可以写入检查一个对象的多个属性的模式。 请考虑以下 Order 记录：
```c#
public record Order(int Items, decimal Cost);
//前面的位置记录类型在显式位置声明两个成员。 首先出现 Items，然后是订单的 Cost。 
public decimal CalculateDiscount(Order order) =>
    order switch
    {
        (Items: > 10, Cost: > 1000.00m) => 0.10m,
        (Items: > 5, Cost: > 500.00m) => 0.05m,
        Order { Cost: > 250.00m } => 0.02m,
        null => throw new ArgumentNullException(nameof(order), "Can't calculate discount on null order"),
        var someObject => 0m,
    };

//如果 Order 类型定义了适当的 Deconstruct 方法，则可以省略模式的属性名称，并使用析构检查属性：
//代码演示了位置模式，其中表达式的属性已析构。
public decimal CalculateDiscount(Order order) =>
    order switch
    {
        ( > 10,  > 1000.00m) => 0.10m,
        ( > 5, > 50.00m) => 0.05m,
        Order { Cost: > 250.00m } => 0.02m,
        null => throw new ArgumentNullException(nameof(order), "Can't calculate discount on null order"),
        var someObject => 0m,
    };
```
## 7.6 列表模式
可以使用 列表模式检查列表或数组中的元素。 列表模式提供了一种将模式应用于序列的任何元素的方法。 此外，还可以应用 放弃模式 (_) 来匹配任何元素，或者应用 切片模式 来匹配零个或多个元素。 以下示例确定数组是否与二进制数字匹配，或 Fibonacci 序列的开头：

```c#
public void MatchElements(int[] array)
{
    if (array is [0,1])
    {
        Console.WriteLine("Binary Digits");
    }
    else if (array is [1,1,2,3,5,8, ..])
    {
        Console.WriteLine("array looks like a Fibonacci sequence");
    }
    else
    {
        Console.WriteLine("Array shape not recognized");
    }
}
```
# 1. 弃元
从 C# 7.0 开始，C# 支持弃元，这是一种在应用程序代码中人为取消使用的占位符变量。 弃元相当于未赋值的变量；它们没有值。

弃元将意图传达给编译器和其他读取代码的文件：你打算忽略表达式的结果。 

你可能需要忽略表达式的结果、元组表达式的一个或多个成员、方法的 out 参数或模式匹配表达式的目标。

```c#
//通过将下划线 (_) 赋给一个变量作为其变量名，指示该变量为一个占位符变量。 例如，以下方法调用返回一个元组，其中第一个值和第二个值为弃元。 area 是以前声明的变量，设置为由 GetCityInformation 返回的第三个组件：
(_, _, area) = city.GetCityInformation(cityName);
```
## 1.1 元组和对象析构
如果应用程序代码使用某些元组元素，但忽略其他元素，这时使用弃元来处理元组就会很有用。

```c#
var (_, _, _, pop1, _, pop2) = QueryCityDataForYears("New York City", 1960, 2010);

Console.WriteLine($"Population change, 1960 to 2010: {pop2 - pop1:N0}");

static (string, double, int, int, int, int) QueryCityDataForYears(string name, int year1, int year2)
{
    int population1 = 0, population2 = 0;
    double area = 0;

    if (name == "New York City")
    {
        area = 468.48;
        if (year1 == 1960)
        {
            population1 = 7781984;
        }
        if (year2 == 2010)
        {
            population2 = 8175133;
        }
        return (name, area, year1, population1, year2, population2);
    }

    return ("", 0, 0, 0, 0, 0);
}
// The example displays the following output:
//      Population change, 1960 to 2010: 393,149
```
类、结构或接口的 Deconstruct 方法还允许从对象中检索和析构一组特定的数据。 如果想只使用析构值的一个子集，可使用弃元。 以下示例将 Person 对象析构为四个字符串（名字、姓氏、城市和省/市/自治区），但舍弃姓氏和省/市/自治区。
```c#
using System;

namespace Discards
{
    public class Person
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }

        public Person(string fname, string mname, string lname,
                      string cityName, string stateName)
        {
            FirstName = fname;
            MiddleName = mname;
            LastName = lname;
            City = cityName;
            State = stateName;
        }

        // Return the first and last name.
        public void Deconstruct(out string fname, out string lname)
        {
            fname = FirstName;
            lname = LastName;
        }

        public void Deconstruct(out string fname, out string mname, out string lname)
        {
            fname = FirstName;
            mname = MiddleName;
            lname = LastName;
        }

        public void Deconstruct(out string fname, out string lname,
                                out string city, out string state)
        {
            fname = FirstName;
            lname = LastName;
            city = City;
            state = State;
        }
    }
    class Example
    {
        public static void Main()
        {
            var p = new Person("John", "Quincy", "Adams", "Boston", "MA");

            // Deconstruct the person object.
            var (fName, _, city, _) = p;
            Console.WriteLine($"Hello {fName} of {city}!");
            // The example displays the following output:
            //      Hello John of Boston!
        }
    }
}
```

## 1.2 利用 switch 的模式匹配
弃元模式可通过 switch 表达式用于模式匹配。 每个表达式（包括 null）都始终匹配弃元模式。

```c#
//以下示例定义了一个 ProvidesFormatInfo 方法，它使用 switch 表达式来确定对象是否提供 IFormatProvider 实现并测试对象是否为 null。 它还使用占位符模式来处理任何其他类型的非 null 对象。
object?[] objects = { CultureInfo.CurrentCulture,
                   CultureInfo.CurrentCulture.DateTimeFormat,
                   CultureInfo.CurrentCulture.NumberFormat,
                   new ArgumentException(), null };
foreach (var obj in objects)
    ProvidesFormatInfo(obj);

static void ProvidesFormatInfo(object? obj) =>
    Console.WriteLine(obj switch
    {
        IFormatProvider fmt => $"{fmt.GetType()} object",
        null => "A null object reference: Its use could result in a NullReferenceException",
        _ => "Some object type without format information"
    });
// The example displays the following output:
//    System.Globalization.CultureInfo object
//    System.Globalization.DateTimeFormatInfo object
//    System.Globalization.NumberFormatInfo object
//    Some object type without format information
//    A null object reference: Its use could result in a NullReferenceException
```
## 1.3 对具有 out 参数的方法的调用
当调用 Deconstruct 方法来析构用户定义类型（类、结构或接口的实例）时，可使用占位符表示单个 out 参数的值。 但当使用 out 参数调用任何方法时，也可使用弃元表示 out 参数的值。

```c#
//以下示例调用 DateTime.TryParse(String, out DateTime) 方法来确定日期的字符串表示形式在当前区域性中是否有效。 因为该示例侧重验证日期字符串，而不是解析它来提取日期，所以方法的 out 参数为占位符。
string[] dateStrings = {"05/01/2018 14:57:32.8", "2018-05-01 14:57:32.8",
                      "2018-05-01T14:57:32.8375298-04:00", "5/01/2018",
                      "5/01/2018 14:57:32.80 -07:00",
                      "1 May 2018 2:57:32.8 PM", "16-05-2018 1:00:32 PM",
                      "Fri, 15 May 2018 20:10:57 GMT" };
foreach (string dateString in dateStrings)
{
    if (DateTime.TryParse(dateString, out _))
        Console.WriteLine($"'{dateString}': valid");
    else
        Console.WriteLine($"'{dateString}': invalid");
}
// The example displays output like the following:
//       '05/01/2018 14:57:32.8': valid
//       '2018-05-01 14:57:32.8': valid
//       '2018-05-01T14:57:32.8375298-04:00': valid
//       '5/01/2018': valid
//       '5/01/2018 14:57:32.80 -07:00': valid
//       '1 May 2018 2:57:32.8 PM': valid
//       '16-05-2018 1:00:32 PM': invalid
//       'Fri, 15 May 2018 20:10:57 GMT': invalid
```
## 1.4 独立弃元
可使用独立弃元来指示要忽略的任何变量。 一种典型的用法是使用赋值来确保一个参数不为 null。 下面的代码使用弃元来强制赋值。 赋值的右侧使用 Null 合并操作符，用于在参数为 null 时引发 System.ArgumentNullException。 此代码不需要赋值结果，因此将对其使用弃元。 该表达式强制执行 null 检查。
```c#
public static void Method(string arg)
{
    _ = arg ?? throw new ArgumentNullException(paramName: nameof(arg), message: "arg can't be null");

    // Do work with arg.
}
//以下示例使用独立占位符来忽略异步操作返回的 Task 对象。 分配任务的效果等同于抑制操作即将完成时所引发的异常。 这使你的意图更加明确：你需要对 Task 使用弃元，并忽略该异步操作生成的任何错误
private static async Task ExecuteAsyncMethods()
{
    Console.WriteLine("About to launch a task...");
    _ = Task.Run(() =>
    {
        var iterations = 0;
        for (int ctr = 0; ctr < int.MaxValue; ctr++)
            iterations++;
        Console.WriteLine("Completed looping operation...");
        throw new InvalidOperationException();
    });
    await Task.Delay(5000);
    Console.WriteLine("Exiting after 5 second delay");
}
// The example displays output like the following:
//       About to launch a task...
//       Completed looping operation...
//       Exiting after 5 second delay

//如果不将任务分配给弃元，则以下代码会生成编译器警告：
private static async Task ExecuteAsyncMethods()
{
    Console.WriteLine("About to launch a task...");
    // CS4014: Because this call is not awaited, execution of the current method continues before the call is completed.
    // Consider applying the 'await' operator to the result of the call.
    Task.Run(() =>
    {
        var iterations = 0;
        for (int ctr = 0; ctr < int.MaxValue; ctr++)
            iterations++;
        Console.WriteLine("Completed looping operation...");
        throw new InvalidOperationException();
    });
    await Task.Delay(5000);
    Console.WriteLine("Exiting after 5 second delay");
```

如果使用调试器运行前面两个示例中的任意一个，则在引发异常时，调试器将停止该程序。 在没有附加调试器的情况下，这两种情况下的异常都会被以静默方式忽略。
## 1.5 _ 也是有效标识符。
_ 也是有效标识符。 当在支持的上下文之外使用时，_ 不视为占位符，而视为有效变量。 如果名为 _ 的标识符已在范围内，则使用 _ 作为独立占位符可能导致：
```c#
//将预期的占位符的值赋给范围内 _ 变量，会导致该变量的值被意外修改。 例如
private static void ShowValue(int _)
{
   byte[] arr = { 0, 0, 1, 2 };
   _ = BitConverter.ToInt32(arr, 0);
   Console.WriteLine(_);
}
 // The example displays the following output:
 //       33619968

 //因违反类型安全而发生的编译器错误。
 private static bool RoundTrips(int _)
{
   string value = _.ToString();
   int newValue = 0;
   _ = Int32.TryParse(value, out newValue);
   return _ == newValue;
}
// The example displays the following compiler error:
//      error CS0029: Cannot implicitly convert type 'bool' to 'int'
//编译器错误 CS0136：“无法在此范围中声明名为 "_" 的局部变量或参数，因为该名称用于在封闭的局部范围中定义局部变量或参数”。例如：
public void DoSomething(int _)
{
 var _ = GetValue(); // Error: cannot declare local _ when one is already in scope
}
// The example displays the following compiler error:
// error CS0136:
//       A local or parameter named '_' cannot be declared in this scope
//       because that name is used in an enclosing local scope
//       to define a local or parameter
```

# 2. 析构元组和其他类型
元组提供一种从方法调用中检索多个值的轻量级方法。 但是，一旦检索到元组，就必须处理它的各个元素。
```c#
public class Example
{
    public static void Main()
    {
        var result = QueryCityData("New York City");

        var city = result.Item1;
        var pop = result.Item2;
        var size = result.Item3;

         // Do something with the data.
    }

    private static (string, int, double) QueryCityData(string name)
    {
        if (name == "New York City")
            return (name, 8175133, 468.48);

        return ("", 0, 0);
    }
}
```
从对象检索多个字段值和属性值可能同样麻烦：必须按成员逐个将字段值或属性值赋给一个变量

在 C# 7.0 及更高版本中，用户可从元组中检索多个元素，或者在单个析构操作中从对象检索多个字段值、属性值和计算值。 若要析构元组，请将其元素分配给各个变量。 析构对象时，将选定值分配给各个变量。

## 2.1 元组
C# 提供内置的元组析构支持，可在单个操作中解包一个元组中的所有项。 用于析构元组的常规语法与用于定义元组的语法相似：将要向其分配元素的变量放在赋值语句左侧的括号中。 例如，以下语句将四元组的元素分配给 4 个单独的变量：
```c#
    private static (string, int, double) QueryCityData(string name)
    {
        if (name == "New York City")
            return (name, 8175133, 468.48);

        return ("", 0, 0);
    }
var (name, address, city, zip) = contact.GetAddressInfo();
//有三种方法可用于析构元组：
//1. 可以在括号内显式声明每个字段的类型。 以下示例使用此方法来析构由 QueryCityData 方法返回的三元组。
public static void Main()
{
    (string city, int population, double area) = QueryCityData("New York City");

    // Do something with the data.
}
//2. 可使用 var 关键字，以便 C# 推断每个变量的类型。 将 var 关键字放在括号外。 以下示例在析构由 QueryCityData 方法返回的三元组时使用类型推理。
public static void Main()
{
    var (city, population, area) = QueryCityData("New York City");

    // Do something with the data.

    //还可在括号内将 var 关键字单独与任一或全部变量声明结合使用
    (string city, var population, var area) = QueryCityData("New York City");
}

//3. 最后，可将元组析构到已声明的变量中。
public static void Main()
{
    string city = "Raleigh";
    int population = 458880;
    double area = 144.8;

    (city, population, area) = QueryCityData("New York City");

    // Do something with the data.
}

//从 C# 10 开始，可在析构中混合使用变量声明和赋值。

public static void Main()
{
    string city = "Raleigh";
    int population = 458880;

    (city, population, double area) = QueryCityData("New York City");

    // Do something with the data.
}
```

即使元组中的每个字段都具有相同的类型，也不能在括号外使用特定类型。 这样做会生成编译器错误 CS8136：“析构 var (...) 形式不允许对 var 使用特定类型。”

## 2.2 使用弃元的元组元素
析构元组时，通常只需要关注某些元素的值。 从 C# 7.0 开始，便可利用 C# 对弃元的支持，弃元是一种仅能写入的变量，且其值将被忽略。 在赋值中，通过下划线字符 (_) 指定弃元。 可弃元任意数量的值，且均由单个弃元 _ 表示。

```c#
using System;

public class ExampleDiscard
{
    public static void Main()
    {
        var (_, _, _, pop1, _, pop2) = QueryCityDataForYears("New York City", 1960, 2010);

        Console.WriteLine($"Population change, 1960 to 2010: {pop2 - pop1:N0}");
    }

    private static (string, double, int, int, int, int) QueryCityDataForYears(string name, int year1, int year2)
    {
        int population1 = 0, population2 = 0;
        double area = 0;

        if (name == "New York City")
        {
            area = 468.48;
            if (year1 == 1960)
            {
                population1 = 7781984;
            }
            if (year2 == 2010)
            {
                population2 = 8175133;
            }
            return (name, area, year1, population1, year2, population2);
        }

        return ("", 0, 0, 0, 0, 0);
    }
}
// The example displays the following output:
//      Population change, 1960 to 2010: 393,149
```
## 2.3 用户定义类型
除了 record 和 DictionaryEntry 类型，C# 不提供析构非元组类型的内置支持。 但是，用户作为类、结构或接口的创建者，可通过实现一个或多个 Deconstruct方法来析构该类型的实例。 该方法返回 void，且要析构的每个值由方法签名中的 out 参数指示。 例如，下面的 Person 类的 Deconstruct 方法返回名字、中间名和姓氏：

```c#
public void Deconstruct(out string fname, out string mname, out string lname)
//可使用与下列代码类似的赋值来析构名为 p 的 Person 类的实例：
var (fName, mName, lName) = p;

//以下示例重载 Deconstruct 方法以返回 Person 对象的各种属性组合。 单个重载返回：
using System;

public class Person
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public string City { get; set; }
    public string State { get; set; }

    public Person(string fname, string mname, string lname,
                  string cityName, string stateName)
    {
        FirstName = fname;
        MiddleName = mname;
        LastName = lname;
        City = cityName;
        State = stateName;
    }

    // Return the first and last name.
    public void Deconstruct(out string fname, out string lname)
    {
        fname = FirstName;
        lname = LastName;
    }

    public void Deconstruct(out string fname, out string mname, out string lname)
    {
        fname = FirstName;
        mname = MiddleName;
        lname = LastName;
    }

    public void Deconstruct(out string fname, out string lname,
                            out string city, out string state)
    {
        fname = FirstName;
        lname = LastName;
        city = City;
        state = State;
    }
}

public class ExampleClassDeconstruction
{
    public static void Main()
    {
        var p = new Person("John", "Quincy", "Adams", "Boston", "MA");

        // Deconstruct the person object.
        var (fName, lName, city, state) = p;
        Console.WriteLine($"Hello {fName} {lName} of {city}, {state}!");
    }
}
// The example displays the following output:
//    Hello John Adams of Boston, MA!
```
具有相同数量参数的多个 Deconstruct 方法是不明确的。 在定义 Deconstruct 方法时，必须小心使用不同数量的参数或“arity”。 在重载解析过程中，不能区分具有相同数量参数的 Deconstruct 方法。
## 2.4 使用弃元的用户定义类型
就像使用元组一样，可使用弃元来忽略 Deconstruct 方法返回的选定项。 每个放弃由一个名为“_”的变量定义，单个析构操作可包含多个放弃。
```c#
// Deconstruct the person object.
var (fName, _, city, _) = p;
Console.WriteLine($"Hello {fName} of {city}!");
// The example displays the following output:
//      Hello John of Boston!
```
## 2.5 用户定义类型的扩展方法
如果没有创建类、结构或接口，仍可通过实现一个或多个 Deconstruct扩展方法来析构该类型的对象，以返回所需值。
```c#
using System;
using System.Collections.Generic;
using System.Reflection;

public static class ReflectionExtensions
{
    public static void Deconstruct(this PropertyInfo p, out bool isStatic,
                                   out bool isReadOnly, out bool isIndexed,
                                   out Type propertyType)
    {
        var getter = p.GetMethod;

        // Is the property read-only?
        isReadOnly = ! p.CanWrite;

        // Is the property instance or static?
        isStatic = getter.IsStatic;

        // Is the property indexed?
        isIndexed = p.GetIndexParameters().Length > 0;

        // Get the property type.
        propertyType = p.PropertyType;
    }

    public static void Deconstruct(this PropertyInfo p, out bool hasGetAndSet,
                                   out bool sameAccess, out string access,
                                   out string getAccess, out string setAccess)
    {
        hasGetAndSet = sameAccess = false;
        string getAccessTemp = null;
        string setAccessTemp = null;

        MethodInfo getter = null;
        if (p.CanRead)
            getter = p.GetMethod;

        MethodInfo setter = null;
        if (p.CanWrite)
            setter = p.SetMethod;

        if (setter != null && getter != null)
            hasGetAndSet = true;

        if (getter != null)
        {
            if (getter.IsPublic)
                getAccessTemp = "public";
            else if (getter.IsPrivate)
                getAccessTemp = "private";
            else if (getter.IsAssembly)
                getAccessTemp = "internal";
            else if (getter.IsFamily)
                getAccessTemp = "protected";
            else if (getter.IsFamilyOrAssembly)
                getAccessTemp = "protected internal";
        }

        if (setter != null)
        {
            if (setter.IsPublic)
                setAccessTemp = "public";
            else if (setter.IsPrivate)
                setAccessTemp = "private";
            else if (setter.IsAssembly)
                setAccessTemp = "internal";
            else if (setter.IsFamily)
                setAccessTemp = "protected";
            else if (setter.IsFamilyOrAssembly)
                setAccessTemp = "protected internal";
        }

        // Are the accessibility of the getter and setter the same?
        if (setAccessTemp == getAccessTemp)
        {
            sameAccess = true;
            access = getAccessTemp;
            getAccess = setAccess = String.Empty;
        }
        else
        {
            access = null;
            getAccess = getAccessTemp;
            setAccess = setAccessTemp;
        }
    }
}

public class ExampleExtension
{
    public static void Main()
    {
        Type dateType = typeof(DateTime);
        PropertyInfo prop = dateType.GetProperty("Now");
        var (isStatic, isRO, isIndexed, propType) = prop;
        Console.WriteLine($"\nThe {dateType.FullName}.{prop.Name} property:");
        Console.WriteLine($"   PropertyType: {propType.Name}");
        Console.WriteLine($"   Static:       {isStatic}");
        Console.WriteLine($"   Read-only:    {isRO}");
        Console.WriteLine($"   Indexed:      {isIndexed}");

        Type listType = typeof(List<>);
        prop = listType.GetProperty("Item",
                                    BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static);
        var (hasGetAndSet, sameAccess, accessibility, getAccessibility, setAccessibility) = prop;
        Console.Write($"\nAccessibility of the {listType.FullName}.{prop.Name} property: ");

        if (!hasGetAndSet | sameAccess)
        {
            Console.WriteLine(accessibility);
        }
        else
        {
            Console.WriteLine($"\n   The get accessor: {getAccessibility}");
            Console.WriteLine($"   The set accessor: {setAccessibility}");
        }
    }
}
// The example displays the following output:
//       The System.DateTime.Now property:
//          PropertyType: DateTime
//          Static:       True
//          Read-only:    True
//          Indexed:      False
//
//       Accessibility of the System.Collections.Generic.List`1.Item property: public
```

## 2.6 系统类型的扩展方法
为了方便起见，某些系统类型提供 Deconstruct 方法。 例如，`System.Collections.Generic.KeyValuePair<TKey,TValue>` 类型提供此功能。 

循环访问 `System.Collections.Generic.Dictionary<TKey,TValue>` 时，每个元素都是 `KeyValuePair<TKey, TValue>`，并且可以析构。
```c#
Dictionary<string, int> snapshotCommitMap = new(StringComparer.OrdinalIgnoreCase)
{
    ["https://github.com/dotnet/docs"] = 16_465,
    ["https://github.com/dotnet/runtime"] = 114_223,
    ["https://github.com/dotnet/installer"] = 22_436,
    ["https://github.com/dotnet/roslyn"] = 79_484,
    ["https://github.com/dotnet/aspnetcore"] = 48_386
};

foreach (var (repo, commitCount) in snapshotCommitMap)
{
    Console.WriteLine(
        $"The {repo} repository had {commitCount:N0} commits as of November 10th, 2021.");
}
//向要没有 Deconstruct 方法的系统类型添加此方法。
public static class NullableExtensions
{
    public static void Deconstruct<T>(
        this T? nullable,
        out bool hasValue,
        out T value) where T : struct
    {
        hasValue = nullable.HasValue;
        value = nullable.GetValueOrDefault();
    }
}
//通过此扩展方法，可将所有 Nullable<T> 类型析构为 (bool hasValue, T value) 的元组。 
DateTime? questionableDateTime = default;
var (hasValue, value) = questionableDateTime;
Console.WriteLine(
    $"{{ HasValue = {hasValue}, Value = {value} }}");

questionableDateTime = DateTime.Now;
(hasValue, value) = questionableDateTime;
Console.WriteLine(
    $"{{ HasValue = {hasValue}, Value = {value} }}");

// Example outputs:
// { HasValue = False, Value = 1/1/0001 12:00:00 AM }
// { HasValue = True, Value = 11/10/2021 6:11:45 PM }
```
## 2.7 record 类型
使用两个或多个位置参数声明记录类型时，编译器将为 `record` 声明中的每个位置参数创建一个带有 `out` 参数的 `Deconstruct` 方法。

# 3. 异常和异常处理
C# 语言的异常处理功能有助于处理在程序运行期间发生的任何意外或异常情况。 异常处理功能使用 try、catch 和 finally 关键字来尝试执行可能失败的操作、在你确定合理的情况下处理故障，以及在事后清除资源。 公共语言运行时 (CLR)、.NET/第三方库或应用程序代码都可生成异常。 异常是使用 throw 关键字创建而成。
```c#
//在以下示例中，方法用于测试除数是否为零，并捕获相应的错误。 如果没有异常处理功能，此程序将终止，并显示 DivideByZeroException was unhandled 错误。
public class ExceptionTest
{
    static double SafeDivision(double x, double y)
    {
        if (y == 0)
            throw new DivideByZeroException();
        return x / y;
    }

    public static void Main()
    {
        // Input for test purposes. Change the values to see
        // exception handling behavior.
        double a = 98, b = 0;
        double result;

        try
        {
            result = SafeDivision(a, b);
            Console.WriteLine("{0} divided by {1} = {2}", a, b, result);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Attempted divide by zero.");
        }
    }
}
```
## 3.1 异常概述
* 异常是最终全都派生自 System.Exception 的类型。
* 在可能抛出异常的语句周围使用 try 代码块。
* 在 try 代码块中出现异常后，控制流会跳转到调用堆栈中任意位置上的首个相关异常处理程序。 在 C# 中，catch 关键字用于定义异常处理程序。
* 如果给定的异常没有对应的异常处理程序，那么程序会停止执行，并显示错误消息。
* 即使引发异常，finally 代码块中的代码仍会执行。 使用 finally 代码块可释放资源。例如，关闭在 try 代码块中打开的任何流或文件。
## 3.2 使用异常
异常可由 .NET 运行时或由程序中的代码引发。 一旦引发了一个异常，此异常会在调用堆栈中传播，直到找到针对它的 catch 语句。 未捕获的异常由系统提供的通用异常处理程序处理，该处理程序会显示一个对话框。

```c#
class CustomException : Exception
{
    public CustomException(string message)
    {
    }
}
private static void TestThrow()
{
    throw new CustomException("Custom exception in TestThrow()");
}
//引发异常后，运行时将检查当前语句，以确定它是否在 try 块内。 如果在，则将检查与 try 块关联的所有 catch 块，以确定它们是否可以捕获该异常。 Catch 块通常会指定异常类型；如果该 catch 块的类型与异常或异常的基类的类型相同，则该 catch 块可处理该方法
try
{
    TestThrow();
}
catch (CustomException ex)
{
    System.Console.WriteLine(ex.ToString());
}
```
执行 catch 块之前，运行时会检查 finally 块。 Finally 块使程序员可以清除中止的 try 块可能遗留下的任何模糊状态，或者释放任何外部资源（例如图形句柄、数据库连接或文件流），而无需等待垃圾回收器在运行时完成这些对象。 例如：
```c#
static void TestFinally()
{
    FileStream? file = null;
    //Change the path to something that works on your machine.
    FileInfo fileInfo = new System.IO.FileInfo("./file.txt");

    try
    {
        file = fileInfo.OpenWrite();
        file.WriteByte(0xF);
    }
    finally
    {
        // Closing the file allows you to reopen it immediately - otherwise IOException is thrown.
        file?.Close();
    }

    try
    {
        file = fileInfo.OpenWrite();
        Console.WriteLine("OpenWrite() succeeded");
    }
    catch (IOException)
    {
        Console.WriteLine("OpenWrite() failed");
    }
}
```
如果 WriteByte() 引发了异常并且未调用 file.Close()，则第二个 try 块中尝试重新打开文件的代码将会失败，并且文件将保持锁定状态。 由于即使引发异常也会执行 finally 块，前一示例中的 finally 块可使文件正确关闭，从而有助于避免错误。

如果引发异常之后没有在调用堆栈上找到兼容的 catch 块，则会出现以下三种情况之一：
* 如果异常存在于终结器内，将中止终结器，并调用基类终结器（如果有）。
* 如果调用堆栈包含静态构造函数或静态字段初始值设定项，将引发 TypeInitializationException，同时将原始异常分配给新异常的 InnerException 属性。
* 如果到达线程的开头，则终止线程。
## 3.3 异常处理
### 3.3.1 catch块
catch 块可以指定要捕获的异常的类型。 该类型规范称为异常筛选器。 异常类型应派生自 Exception。 一般情况下，不要将 Exception 指定为异常筛选器，除非了解如何处理可能在 try 块中引发的所有异常，或者已在 catch 块的末尾处包括了 Exception 语句。

当以下条件为 true 时，捕获异常：
* 能够很好地理解可能会引发异常的原因，并且可以实现特定的恢复，例如捕获 FileNotFoundException 对象时提示用户输入新文件名。
* 可以创建和引发一个新的、更具体的异常。
```c#
int GetInt(int[] array, int index)
{
    try
    {
        return array[index];
    }
    catch (IndexOutOfRangeException e)
    {
        throw new ArgumentOutOfRangeException(
            "Parameter index is out of range.", e);
    }
}
```
* 想要先对异常进行部分处理，然后再将其传递以进行更多处理。 在下面的示例中，catch 块用于在重新引发异常之前将条目添加到错误日志。
```c#
try
{
    // Try to access a resource.
}
catch (UnauthorizedAccessException e)
{
    // Call a custom error logging procedure.
    LogError(e);
    // Re-throw the error.
    throw;
}
```
还可以指定异常筛选器，以向 catch 子句添加布尔表达式。 异常筛选器表明仅当条件为 true 时，特定 catch 子句才匹配。 在以下示例中，两个 catch 子句均使用相同的异常类，但是会检查其他条件以创建不同的错误消息：
```c#
int GetInt(int[] array, int index)
{
    try
    {
        return array[index];
    }
    catch (IndexOutOfRangeException e) when (index < 0) 
    {
        throw new ArgumentOutOfRangeException(
            "Parameter index cannot be negative.", e);
    }
    catch (IndexOutOfRangeException e)
    {
        throw new ArgumentOutOfRangeException(
            "Parameter index cannot be greater than the array size.", e);
    }
}
```
始终返回 false 的异常筛选器可用于检查所有异常，但不可用于处理异常。 典型用途是记录异常：
```c#
//LogException 方法始终返回 false，使用此异常筛选器的 catch 子句均不匹配。 catch 子句可以是通用的，使用 System.Exception后面的子句可以处理更具体的异常类。
public static void Main()
{
    try
    {
        string? s = null;
        Console.WriteLine(s.Length);
    }
    catch (Exception e) when (LogException(e))
    {
    }
    Console.WriteLine("Exception must have been handled");
}

private static bool LogException(Exception e)
{
    Console.WriteLine($"\tIn the log routine. Caught {e.GetType()}");
    Console.WriteLine($"\tMessage: {e.Message}");
    return false;
}
```
### 3.3.2 Finally 块
finally 块让你可以清理在 try 块中所执行的操作。 如果存在 finally 块，将在执行 try 块和任何匹配的 catch 块之后，最后执行它。 无论是否会引发异常或找到匹配异常类型的 catch 块，finally 块都将始终运行。
finally 块可用于发布资源（如文件流、数据库连接和图形句柄）而无需等待运行时中的垃圾回收器来完成对象。
```c#
FileStream? file = null;
FileInfo fileinfo = new System.IO.FileInfo("./file.txt");
try
{
    file = fileinfo.OpenWrite();
    file.WriteByte(0xF);
}
finally
{
    // Check for null because OpenWrite might have failed.
    file?.Close();
}
```
## 3.4 创建和引发异常
异常用于指示在运行程序时发生了错误。 此时将创建一个描述错误的异常对象，然后使用 throw 关键字引发。 然后，运行时搜索最兼容的异常处理程序。


当存在下列一种或多种情况时，程序员应引发异常：

1. 方法无法完成其定义的功能
```c#
//如果一种方法的参数具有无效的值
static void CopyObject(SampleClass original)
{
    _ = original ?? throw new ArgumentException("Parameter cannot be null", nameof(original));
}
```

2. 根据对象的状态，对某个对象进行不适当的调用。
```c#
// 一个示例可能是尝试写入只读文件。 在对象状态不允许操作的情况下，引发 InvalidOperationException 的实例或基于此类的派生的对象。 以下代码是引发 InvalidOperationException 对象的方法示例：
public class ProgramLog
{
    FileStream logFile = null!;
    public void OpenLog(FileInfo fileName, FileMode mode) { }

    public void WriteLog()
    {
        if (!logFile.CanWrite)
        {
            throw new InvalidOperationException("Logfile cannot be read-only");
        }
        // Else write data to the log and return.
    }
}
```
3. 方法的参数引发了异常。
```c#
// 在这种情况下，应捕获原始异常，并创建 ArgumentException 实例。 应将原始异常作为 InnerException 参数传递给 ArgumentException 的构造函数：
static int GetValueFromArray(int[] array, int index)
{
    try
    {
        return array[index];
    }
    catch (IndexOutOfRangeException e)
    {
        throw new ArgumentOutOfRangeException(
            "Parameter index is out of range.", e);
    }
}
```
## 3.5 引发异常时应避免的情况
以下列表标识了引发异常时要避免的做法：

1. 不要使用异常在正常执行过程中更改程序的流。 使用异常来报告和处理错误条件。
2. 只能引发异常，而不能作为返回值或参数返回异常。
3. 请勿有意从自己的源代码中引发 System.Exception、System.SystemException、System.NullReferenceException 或 System.IndexOutOfRangeException。
4. 不要创建可在调试模式下引发，但不会在发布模式下引发的异常。 若要在开发阶段确定运行时错误，请改用调试断言。
## 3.6 定义异常类
程序可以引发 System 命名空间中的预定义异常类（前面提到的情况除外），或通过从 Exception 派生来创建其自己的异常类。 派生类应该至少定义四个构造函数：一个无参数构造函数、一个用于设置消息属性，还有一个用于设置 Message 和 InnerException 属性。 第四个构造函数用于序列化异常。 新的异常类应可序列化。 例如：
```c#
[Serializable]
public class InvalidDepartmentException : Exception
{
    public InvalidDepartmentException() : base() { }
    public InvalidDepartmentException(string message) : base(message) { }
    public InvalidDepartmentException(string message, Exception inner) : base(message, inner) { }

    // A constructor is needed for serialization when an
    // exception propagates from a remoting server to the client.
    protected InvalidDepartmentException(System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
}
```
## 3.7 编译器生成的异常

# 4. C# 标识符命名规则和约定

## 4.1 命名规则
有效标识符必须遵循以下规则：

1. 标识符必须以字母或下划线 (_) 开头。
2. 标识符可以包含 Unicode 字母字符、十进制数字字符、Unicode 连接字符、Unicode 组合字符或 Unicode 格式字符。 有关 Unicode 类别的详细信息，请参阅 Unicode 类别数据库。 可以在标识符上使用 @ 前缀来声明与 C# 关键字匹配的标识符。 @ 不是标识符名称的一部分。 例如，@if 声明名为 if 的标识符。 这些逐字标识符主要用于与使用其他语言声明的标识符的互操作性。

## 4.2 命名约定
除了规则之外，在 .NET API 中还使用了许多标识符命名约定。 按照约定，C# 程序对类型名称、命名空间和所有公共成员使用 PascalCase。 此外，以下约定也很常见：

1. 接口名称以大写字母 I 开头。
2. 属性类型以单词 Attribute 结尾。
3. 枚举类型对非标记使用单数名词，对标记使用复数名词。
4. 标识符不应包含两个连续的下划线 (_) 字符。 这些名称保留给编译器生成的标识符。

# 5. C# 编码约定
## 5.1 命名约定

### 5.1.1 帕斯卡拼写法
命名 class、record 或 struct 时，使用 pascal 大小写（“PascalCasing”）。

命名 interface 时，使用 pascal 大小写并在名称前面加上前缀 I。 这可以清楚地向使用者表明这是 interface。

命名类型的 public 成员（例如字段、属性、事件、方法和本地函数）时，请使用 pascal 大小写。

编写位置记录时，对参数使用 pascal 大小写，因为它们是记录的公共属性。

### 5.1.2 驼峰式大小写

命名 private 或 internal 字段时，使用驼峰式大小写（“camelCasing”），并且它们以 _ 作为前缀。

使用为 private 或 internal 的static 字段时 请使用 s_ 前缀，对于线程静态，请使用 t_。

编写方法参数时，请使用驼峰式大小写。
### 5.1.3 其他命名约定
在不包括 using 指令的示例中，使用命名空间限定。 如果你知道命名空间默认导入项目中，则不必完全限定来自该命名空间的名称。 如果对于单行来说过长，则可以在点 (.) 后中断限定名称，如下面的示例所示。
```c#
var currentPerformanceCounterCategory = new System.Diagnostics.
    PerformanceCounterCategory();

```
## 5.2 布局约定

## 5.3 注释约定

## 5.4 语言准则




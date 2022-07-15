# 1. .NET Core 和 .NET Standard 单元测试最佳做法


## 1.1 优质单元测试的特征

快速。 对成熟项目进行数千次单元测试，这很常见。 应花非常少的时间来运行单元测试。 几毫秒。

独立。 单元测试是独立的，可以单独运行，并且不依赖文件系统或数据库等任何外部因素。

可重复。 运行单元测试的结果应该保持一致，也就是说，如果在运行期间不更改任何内容，总是返回相同的结果。

自检查。 测试应该能够在没有任何人工交互的情况下，自动检测测试是否通过。

及时。 与要测试的代码相比，编写单元测试不应花费过多不必要的时间。 如果发现测试代码与编写代码相比需要花费大量的时间，请考虑一种更易测试的设计。

## 1.2 代码覆盖率

高代码覆盖率百分比通常与较高的代码质量相关联。 但该度量值本身无法确定代码的质量。 设置过高的代码覆盖率百分比目标可能会适得其反。 假设一个复杂的项目有数千个条件分支，并且假设你设定了一个 95% 代码覆盖率的目标。 该项目当前维保持 90% 的代码覆盖率。 要覆盖剩余 5% 的所有边缘事例，需要花费巨大的工作量，而且价值主张会迅速降低。

高代码覆盖率百分比不指示成功，也不意味着高代码质量。 它仅仅表示单元测试所涵盖的代码量。 有关详细信息，请参阅单元测试代码覆盖率。


## 1.3 为测试命名
测试的名称应包括三个部分：

1. 要测试的方法的名称。
2. 测试的方案。
3. 调用方案时的预期行为。

```c#
//No
[Fact]
public void Test_Single()
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add("0");

    Assert.Equal(0, actual);
}
//Yeah
[Fact]
public void Add_SingleNumber_ReturnsSameNumber()
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add("0");

    Assert.Equal(0, actual);
}
```

## 1.4 安排测试
“Arrange、Act、Assert”是单元测试时的常见模式。 顾名思义，它包含三个主要操作：

1. 安排对象，根据需要对其进行创建和设置。
2. 作用于对象。
3. 断言某些项按预期进行。

```c#
//No
[Fact]
public void Add_EmptyString_ReturnsZero()
{
    // Arrange
    var stringCalculator = new StringCalculator();

    // Assert
    Assert.Equal(0, stringCalculator.Add(""));
}

//Yeah
[Fact]
public void Add_EmptyString_ReturnsZero()
{
    // Arrange
    var stringCalculator = new StringCalculator();

    // Act
    var actual = stringCalculator.Add("");

    // Assert
    Assert.Equal(0, actual);
}
```

## 1.4 以最精简方式编写通过测试
为什么？

1. 测试对代码库的未来更改更具弹性。
2. 更接近于测试行为而非实现。
3. 包含比通过测试所需信息更多信息的测试更可能将错误引入测试，并且可能使测试的意图变得不太明确。 编写测试时需要将重点放在行为上。 在模型上设置额外的属性或在不需要时使用非零值，只会偏离所要证明的内容。

```c#
//No
[Fact]
public void Add_SingleNumber_ReturnsSameNumber()
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add("42");

    Assert.Equal(42, actual);
}
//Yeah
[Fact]
public void Add_SingleNumber_ReturnsSameNumber()
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add("0");

    Assert.Equal(0, actual);
}
```

## 1.5 避免魔幻字符串
```c#
//No
[Fact]
public void Add_BigNumber_ThrowsException()
{
    var stringCalculator = new StringCalculator();

    Action actual = () => stringCalculator.Add("1001");

    Assert.Throws<OverflowException>(actual);
}
//Yeah
[Fact]
void Add_MaximumSumResult_ThrowsOverflowException()
{
    var stringCalculator = new StringCalculator();
    const string MAXIMUM_RESULT = "1001";

    Action actual = () => stringCalculator.Add(MAXIMUM_RESULT);

    Assert.Throws<OverflowException>(actual);
}
```

## 1.6 在测试中应避免逻辑
```c#
//No
[Fact]
public void Add_MultipleNumbers_ReturnsCorrectResults()
{
    var stringCalculator = new StringCalculator();
    var expected = 0;
    var testCases = new[]
    {
        "0,0,0",
        "0,1,2",
        "1,2,3"
    };

    foreach (var test in testCases)
    {
        Assert.Equal(expected, stringCalculator.Add(test));
        expected += 3;
    }
}
//Yeah
[Theory]
[InlineData("0,0,0", 0)]
[InlineData("0,1,2", 3)]
[InlineData("1,2,3", 6)]
public void Add_MultipleNumbers_ReturnsSumOfNumbers(string input, int expected)
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add(input);

    Assert.Equal(expected, actual);
}
```
## 1.7 更偏好 helper 方法而非 setup 和 teardown


## 1.8 避免多个操作
1. 测试失败时，无法确定哪个操作失败。
2. 确保测试仅侧重于单个用例。
3. 让你从整体上了解测试失败原因。

```c#
//No
[Fact]
public void Add_EmptyEntries_ShouldBeTreatedAsZero()
{
    // Act
    var actual1 = stringCalculator.Add("");
    var actual2 = stringCalculator.Add(",");

    // Assert
    Assert.Equal(0, actual1);
    Assert.Equal(0, actual2);
}
//Yeah
[Theory]
[InlineData("", 0)]
[InlineData(",", 0)]
public void Add_EmptyEntries_ShouldBeTreatedAsZero(string input, int expected)
{
    // Arrange
    var stringCalculator = new StringCalculator();

    // Act
    var actual = stringCalculator.Add(input);

    // Assert
    Assert.Equal(expected, actual);
}
```
## 1.9 通过单元测试公共方法验证专有方法
在大多数情况下，不需要测试专用方法。 专用方法是实现细节。 可以这样认为：专用方法永远不会孤立存在。 在某些时候，存在调用专用方法作为其实现的一部分的面向公共的方法。 你应关心的是调用到专用方法的公共方法的最终结果。
```c#
public string ParseLogLine(string input)
{
    var sanitizedInput = TrimInput(input);
    return sanitizedInput;
}

private string TrimInput(string input)
{
    return input.Trim();
}
//你的第一反应可能是开始为 TrimInput 编写测试，因为想要确保该方法按预期工作。 但是，ParseLogLine 完全有可能以一种你所不期望的方式操纵 sanitizedInput，使得对 TrimInput 的测试变得毫无用处。

//真正的测试应该针对面向公共的方法 ParseLogLine 进行，因为这是你最终应该关心的。
public void ParseLogLine_StartsAndEndsWithSpace_ReturnsTrimmedResult()
{
    var parser = new Parser();

    var result = parser.ParseLogLine(" a ");

    Assert.Equals("a", result);
}
```
## 1.10 Stub 静态引用
单元测试的原则之一是其必须完全控制被测试的系统。 当生产代码包含对静态引用（例如 DateTime.Now）的调用时，这可能会存在问题。 考虑下列代码

```c#
public int GetDiscountedPrice(int price)
{
    if (DateTime.Now.DayOfWeek == DayOfWeek.Tuesday)
    {
        return price / 2;
    }
    else
    {
        return price;
    }
}

//Test
public void GetDiscountedPrice_NotTuesday_ReturnsFullPrice()
{
    var priceCalculator = new PriceCalculator();

    var actual = priceCalculator.GetDiscountedPrice(2);

    Assert.Equals(2, actual)
}

public void GetDiscountedPrice_OnTuesday_ReturnsHalfPrice()
{
    var priceCalculator = new PriceCalculator();

    var actual = priceCalculator.GetDiscountedPrice(2);

    Assert.Equals(1, actual);
}
//如果在星期二运行测试套件，则第二个测试将通过，但第一个测试将失败。
//如果在任何其他日期运行测试套件，则第一个测试将通过，但第二个测试将失败。

//要解决这些问题，需要将“seam”引入生产代码中。 一种方法是在接口中包装需要控制的代码，并使生产代码依赖于该接口。
public interface IDateTimeProvider
{
    DayOfWeek DayOfWeek();
}

public int GetDiscountedPrice(int price, IDateTimeProvider dateTimeProvider)
{
    if (dateTimeProvider.DayOfWeek() == DayOfWeek.Tuesday)
    {
        return price / 2;
    }
    else
    {
        return price;
    }
}
//test
public void GetDiscountedPrice_NotTuesday_ReturnsFullPrice()
{
    var priceCalculator = new PriceCalculator();
    var dateTimeProviderStub = new Mock<IDateTimeProvider>();
    dateTimeProviderStub.Setup(dtp => dtp.DayOfWeek()).Returns(DayOfWeek.Monday);

    var actual = priceCalculator.GetDiscountedPrice(2, dateTimeProviderStub);

    Assert.Equals(2, actual);
}

public void GetDiscountedPrice_OnTuesday_ReturnsHalfPrice()
{
    var priceCalculator = new PriceCalculator();
    var dateTimeProviderStub = new Mock<IDateTimeProvider>();
    dateTimeProviderStub.Setup(dtp => dtp.DayOfWeek()).Returns(DayOfWeek.Tuesday);

    var actual = priceCalculator.GetDiscountedPrice(2, dateTimeProviderStub);

    Assert.Equals(1, actual);
}
```
# 2. 使用 NUnit 和 .NET Core 进行 C# 单元测试

```c#
namespace JMelt.Tests
{
    using JMelt.Models;

    [TestFixture]
    public class TestMyCustom
    {
        [SetUp]
        public void Initialize()
        {
            //这里写运行每一个测试用例时需要初始化的代码
        }

        /// <summary>
        /// 测试 custom.ini 配置信息的读取
        /// </summary>
        [Test]
        public void TestReadIniFile()
        {
            var length = MyCustom.CustomConfig.Count;
            Assert.That(length, Is.EqualTo(10), "custom.ini read error");
        }

```
在.Net平台有三种单元测试工具，分别为MS Test、NUnit、Xunit.Net。

1. MS Test为微软产品，集成在Visual Studio 2008+工具中。

2. NUnit为.Net开源测试框架（采用C#开发），广泛用于.Net平台的单元测试和回归测试中,官方网址(www.nunit.org)。

3. XUnit.Net为NUnit的改进版。

## 2.1 断言。

NUnit一共有五个断言类，分别是Assert、StringAssert、FileAssert、DirectoryAssert、CollectionAssert，它们都在NUnit.Framework命名空间，其中Assert是常用的，而另外四个断言类，顾名思义，分别对应于字符串的断言、文件的断言、目录的断言、集合的断言。理论上，仅Assert类就可以完成所有条件的判断，然而，如果合理的运用后面的四个断言，将使代码更加简洁、美观，也更加便于理解和维护。

## 2.2 NUnit的使用。
`https://www.cnblogs.com/zwt-blog/p/5788222.html`
1. `[TestFixture(arguments)]`属性标记类为测试类，若没有填写参数，则测试类必须含有无参构造函数，否则需要相应的有参构造函数。也可以多个测试`[TestFixture(1), TestFixture("a")]`
2. [SetUp]: 标识测试用例初始化函数，每个测试用例运行都会执行一次。
3. [Test]: 标识测试用例。

4. [TearDown]: 标识测试用例资源释放函数。
5. `[TestCase(arguments)]`属性标记有参数无返值方法为测试方法(泛型方法一样标记),想要多次测试可用逗号隔开`([TestCase(1,2), TestCase(2,3)])`。
6. `[TestCase(arguments,Result = value)]`属性标记带参数与返回值的方法为测试方法，执行的时候把预期的返回值也告诉NUnit，如果返回值不对，测试同样无法通过。
7. [Repeat]属性标记测试方法重复执行多少次，如：[Test, Repeat(100)]。\

## 2.3 Nunit常用类和方法
1、Assert(断言)：如果断言失败，方法将没有返回，并且报告一个错误。

1）、测试二个参数是否相等

Assert.AreEqual;

Assert.AreEqual;

2）、测试二个参数是否引用同一个对象

Assert.AreSame;

Assert.AreNotSame;

3）、测试一个对象是否被一个数组或列表所包含

Assert.Contains;

4）、测试一个对象是否大于另一个对象

Assert.Greater;

5）、测试一个对象是否小于另一个对象

Assert.Less;

6）、类型断言：

Assert.IsInstanceOfType;

Assert.IsAssignableFrom；

7）、条件测试：

Assert.IsTrue;

Assert.IsFalse;

Assert.IsNull;

Assert.IsNotNull;

Assert.IsNaN;用来判断指定的值是否为数字。

Assert.IsEmpty;

Assert.IsNotEmpty;

Assert.IsEmpty;

Assert.IsNotEmpty;

8）、其他断言：

Assert.Fail;方法为你提供了创建一个失败测试的能力，这个失败是基于其他方法没有封装的测试。对于开发你自己的特定项目的断言，它也很有用。

Assert.Pass;强行让测试通过

2、字符串断言(StringAssert)：提供了许多检验字符串值的有用的方法

StringAssert.Contains;

StringAssert.StartsWith;

StringAssert.EndsWith;

StringAssert.AreEqualIgnoringCase;

3、CollectionAssert类

CollectionAssert.AllItemsAreInstancesOfType;集合中的各项是否是某某类型的实例

CollectionAssert.AllItemsAreNotNull:集合中的各项均不为空

CollectionAssert.AllItemsAreUnique;集合中的各项唯一

CollectionAssert.AreEqual;两个集合相等

CollectionAssert.AreEquivalent;两个集合相当

CollectionAssert.AreNotEqual;两个集合不相等

CollectionAssert.AreNotEquivalent;两个集合不相当

CollectionAssert.Contains;

CollectionAssert.DoesNotContain;集合中不包含某对象

CollectionAssert.IsSubsetOf:一个集合是另外一个集合的子集

CollectionAssert.IsNotSubsetOf:一个集合不是另外一个集合的子集

CollectionAssert.IsEmpty;集合为空

CollectionAssert.IsNotEmpty;集合不为空

CollectionAssert.IsOrdered;集合的各项已经排序

4、FileAssert

FileAssert.AreEqual;

FileAssert.AreNotEqual;

5、DirectoryAssert

DirectoryAssert.AreEqual;

DirectoryAssert.AreNotEqual;

DirectoryAssert.IsEmpty;

DirectoryAssert.IsNotEmpty;

DirectoryAssert.IsWithin;

DirectoryAssert.IsNotWithin;



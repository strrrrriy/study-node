# 1. 如何显示命令行参数
可通过顶级语句或 Main 的可选参数来访问在命令行处提供给可执行文件的参数。 参数以字符串数组的形式提供。 数组的每个元素都包含 1 个参数。 删除参数之间的空格。 例如，下面是对虚构可执行文件的命令行调用

 | 命令行上的输入 | 传递给 Main 的字符串数组 |

 | executable.exe a b c | "a" "b" “c” |

 | executable.exe one two | "one" "two" |

 | executable.exe "one two" three | "one two" "three" |


 本示例显示了传递给命令行应用程序的命令行参数。 显示的输出对应于上表中的第一项。
 ```c#
// The Length property provides the number of array elements.
Console.WriteLine($"parameter count = {args.Length}");

for (int i = 0; i < args.Length; i++)
{
    Console.WriteLine($"Arg[{i}] = [{args[i]}]");
}

/* Output (assumes 3 cmd line args):
    parameter count = 3
    Arg[0] = [a]
    Arg[1] = [b]
    Arg[2] = [c]
*/
 ```

# 2. 使用类和对象探索面向对象的编程
## 2.1 创建应用程序
使用终端窗口，创建名为 classes 的目录。 可以在其中生成应用程序。 将此目录更改为当前目录，并在控制台窗口中键入 dotnet new console。 此命令可创建应用程序。 打开 Program.cs。 应如下所示：
```c#
// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
```
 通常情况下，开发者都会在不同的文本文件中定义每个类。 这样可以更轻松地管理不断增大的程序。 在 Classes 目录中，新建名为 BankAccount.cs 的文件。

在本教程中，银行帐户支持以下行为：
1. 用一个 10 位数唯一标识银行帐户。
2. 用字符串存储一个或多个所有者名称。
3. 可以检索余额。
4. 接受存款。
5. 接受取款。
6. 初始余额必须是正数。
7. 取款不能产生负余额。

## 2.2 定义银行帐户类型

首先，创建定义此行为的类的基本设置。 使用 File:New 命令创建新文件。 将其命名为“BankAccount.cs”。 将以下代码添加到 BankAccount.cs 文件：
```c#
namespace Classes;

public class BankAccount
{
    public string Number { get; }
    public string Owner { get; set; }
    //Decimal 类型适用于需要大量重要整数和小数位数且没有舍入错误的财务计算。 Decimal类型仍需要舍入，但它最大限度地减少了因舍入而导致的错误。
    public decimal Balance { get; }
    // 读取每个成员的名称应该能够为自己或其他开发者提供了解类用途的足够信息。
    public void MakeDeposit(decimal amount, DateTime date, string note)
    {
    }

    public void MakeWithdrawal(decimal amount, DateTime date, string note)
    {
    }
}
```
## 2.3 打开新帐户
要实现的第一个功能是打开银行帐户。 打开帐户时，客户必须提供初始余额，以及此帐户的一个或多个所有者的相关信息。

新建 BankAccount 类型的对象意味着定义构造函数来赋值。BankAccount 构造函数是与类同名的成员。 它用于初始化该类类型的对象。 将以下构造函数添加到 BankAccount 类型。 将下面的代码放在 MakeDeposit 声明的上方：
```c#
public BankAccount(string name, decimal initialBalance)
{
    this.Owner = name;
    this.Balance = initialBalance;
}
//this可选
//this仅当局部变量或参数的名称与该字段或属性相同时，才需要限定符。 this除非有必要，否则将在整个本文的其余部分中省略限定符。

public BankAccount(string name, decimal initialBalance)
{
    Owner = name;
    Balance = initialBalance;
}

//构造函数是在使用 new 创建对象时进行调用。 将 Program.cs 中的代码行 Console.WriteLine("Hello World!"); 替换为以下代码行（将 <name> 替换为自己的名称）：
using Classes;

var account = new BankAccount("<name>", 1000);
Console.WriteLine($"Account {account.Number} was created for {account.Owner} with {account.Balance} initial balance.");

//有没有注意到帐号为空？ 是时候解决这个问题了。 帐号应在构造对象时分配。 但不得由调用方负责创建。 BankAccount 类代码应了解如何分配新帐号。 一种简单方法是从 10 位数字开始。 帐号随每个新建的帐户而递增。 最后，在构造对象时，存储当前的帐号。
private static int accountNumberSeed = 1234567890;
// 它是 private，这意味着只能通过 BankAccount 类中的代码访问它。 这是一种分离公共责任（如拥有帐号）与私有实现（如何生成帐号）的方法。 它还 static意味着它由所有 BankAccount 对象共享。 非静态变量的值对于 BankAccount 对象的每个实例是唯一的。 将下面两行代码添加到构造函数，以分配帐号。 将它们放在 this.Balance = initialBalance 行后面：
this.Number = accountNumberSeed.ToString();
accountNumberSeed++;
```
命令行运行: `dotnet run `
## 2.4 创建存款和取款
银行帐户类必须接受存款和取款，才能正常运行。 接下来，将为银行帐户创建每笔交易日记，实现存款和取款。 跟踪每个事务比仅更新每个事务的余额具有一些优势。 历史记录可用于审核所有交易，并管理每日余额。 在需要时从所有事务的历史记录中计算余额，确保固定的单个事务中的任何错误都将正确反映在下一次计算的余额中。

先新建表示交易的类型。 事务是一种不承担任何责任的简单类型。 但需要有多个属性。 新建名为 Transaction.cs 的文件。 向新文件添加以下代码：
```c#
namespace Classes;

public class Transaction
{
    public decimal Amount { get; }
    public DateTime Date { get; }
    public string Notes { get; }

    public Transaction(decimal amount, DateTime date, string note)
    {
        Amount = amount;
        Date = date;
        Notes = note;
    }
}
//现在，将 Transaction 对象的 List<T> 添加到 BankAccount 类中。 将以下声明放在 BankAccount.cs 文件中的构造函数后面：
private List<Transaction> allTransactions = new List<Transaction>();

//现在，让我们来正确计算 Balance。 可以通过对所有交易的值进行求和来计算当前余额。 由于当前代码，你只能计算出帐户的初始余额，因此必须更新 Balance 属性。 将 BankAccount.cs 中的 public decimal Balance { get; } 行替换为以下代码：
public decimal Balance
{
    get
    {
        decimal balance = 0;
        foreach (var item in allTransactions)
        {
            balance += item.Amount;
        }

        return balance;
    }
}

```


实现 MakeDeposit 和 MakeWithdrawal 方法。 这些方法将强制实施最后两个规则：初始余额必须为正，任何取款不得创建负余额


这些规则引入了 异常的概念。 指示方法无法成功完成其工作的标准方法是引发异常。 异常类型及其关联消息描述了错误。 在这里，如果存款金额不大于 0，该方法 MakeDeposit 将引发异常。 如果取款金额不大于 0，或者应用取款会导致负余额，该方法 MakeWithdrawal 将引发异常。 将以下代码添加到 allTransactions 列表的声明后面：

```c#
public void MakeDeposit(decimal amount, DateTime date, string note)
{
    if (amount <= 0)
    {
        throw new ArgumentOutOfRangeException(nameof(amount), "Amount of deposit must be positive");
    }
    var deposit = new Transaction(amount, date, note);
    allTransactions.Add(deposit);
}

public void MakeWithdrawal(decimal amount, DateTime date, string note)
{
    if (amount <= 0)
    {
        throw new ArgumentOutOfRangeException(nameof(amount), "Amount of withdrawal must be positive");
    }
    if (Balance - amount < 0)
    {
        throw new InvalidOperationException("Not sufficient funds for this withdrawal");
    }
    var withdrawal = new Transaction(-amount, date, note);
    allTransactions.Add(withdrawal);
}
//throw 语句将引发异常。 当前块执行结束，将控制权移交给在调用堆栈中发现的第一个匹配的 catch 块。 添加 catch 块可以稍后再测试一下此代码。
```
构造函数应进行一处更改，更改为添加初始交易，而不是直接更新余额。 由于已编写 MakeDeposit 方法，因此通过构造函数调用它。 完成的构造函数应如下所示：
```c#
public BankAccount(string name, decimal initialBalance)
{
    Number = accountNumberSeed.ToString();
    accountNumberSeed++;

    Owner = name;
    MakeDeposit(initialBalance, DateTime.Now, "Initial balance");
}

//DateTime.Now 是返回当前日期和时间的属性。 通过添加方法中的 Main 一些存款和取款来测试此代码，并遵循创建一个新 BankAccount代码的代码：
account.MakeWithdrawal(500, DateTime.Now, "Rent payment");
Console.WriteLine(account.Balance);
account.MakeDeposit(100, DateTime.Now, "Friend paid me back");
Console.WriteLine(account.Balance);
//接下来，通过尝试创建负余额的帐户来测试是否捕获错误条件。 在刚刚添加的上述代码后面，添加以下代码：
// Test that the initial balances must be positive.
BankAccount invalidAccount;
try
{
    invalidAccount = new BankAccount("invalid", -55);
}
catch (ArgumentOutOfRangeException e)
{
    Console.WriteLine("Exception caught creating account with negative balance");
    Console.WriteLine(e.ToString());
    return;
}
```
使用 和 catch 语句，标记可能会引发异常的代码块，并捕获预期错误。 可以使用相同的技术，测试代码能否在取款后余额为负数时引发异常。 在方法中Main声明invalidAccount之前添加以下代码
```c#
// Test for a negative balance.
try
{
    account.MakeWithdrawal(750, DateTime.Now, "Attempt to overdraw");
}
catch (InvalidOperationException e)
{
    Console.WriteLine("Exception caught trying to overdraw");
    Console.WriteLine(e.ToString());
}
```

## 2.5 挑战 - 记录所有交易
为了完成本教程，可以编写 GetAccountHistory 方法，为交易历史记录创建 string。 将此方法添加到 BankAccount 类型中：
```c#
public string GetAccountHistory()
{
    var report = new System.Text.StringBuilder();

    decimal balance = 0;
    report.AppendLine("Date\t\tAmount\tBalance\tNote");
    foreach (var item in allTransactions)
    {
        balance += item.Amount;
        report.AppendLine($"{item.Date.ToShortDateString()}\t{item.Amount}\t{balance}\t{item.Notes}");
    }

    return report.ToString();
}

//历史记录使用 StringBuilder 类设置字符串的格式，该字符串包含每个事务的一行。 在前面的教程中，也遇到过字符串格式设置代码。 新增的一个字符为 \t。 这用于插入选项卡，从而设置输出格式。

//添加以下代码行，在 Program.cs 中对它进行测试：
Console.WriteLine(account.GetAccountHistory());
```
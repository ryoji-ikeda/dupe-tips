# Numeric Input Validation Vulnerabilities (NIVV)

## What is an NIVV?
- An NIVV occurs when a plugin accepts numerical inputs without checking if the value is valid, finite, safe or within expected range.
- Issues usually occur when plugins trust user-given numbers too much, usually in commands.

## 1. NaN Poisoning

**NaN** means "Not a number", some programming languages i.e. java (the one plugins are programmed in) allow `NaN` as a float

### Why it's dangerous

`NaN` behaves weirdly in comparisons. in java, comparisons usually return `false` For example:

```java
double amount = Double.NaN;

System.out.println(amount > 0); // false
System.out.println(amount <= balance); // false
System.out.println(amount == amount); // false
```

If a plugin does not explicitly reject `NaN`, it may corrupt balance or cause calculations to behave incorrectly

There is an example of this in the "examples of exploits" section at the end

## 2. Scientific notation abuse

Some plugins allow scientific notation even when the plugin doesn't expect it.

### Examples:
```txt
1e5
9e18732
-1e19
```

### Why it's dangerous

Scientific notation can create extremely large or small values and in some cases crash a server
There is an example of this in the "examples of exploits" section at the end

## 3. Negative number bypass

Some plugins forget to add checks reject negative values however this is super unlikely

Example:
```java
double amount = Double.parseDouble(input);

balance = balance - amount;
```

### Why it's dangerous

Subtracting a negative value will add to the value instead, creating money from thin air
```java
double balance = 100;
double amount = -50;

balance = balance - amount;

System.out.println(balance); // 150
```

## Examples of exploits
- [Ultimate Teams](https://dupedb.net/exploit/tXS0LusTngX) had an NaN Poisoning vulnerability that lets users withdraw any amount of money from a team after running `/withdraw NaN`
- [FatalMc](https://dupedb.net/exploit/qQaGd8O_MNI) had a scientific notation abuse vulnerability that lets users crash the server by running a single command
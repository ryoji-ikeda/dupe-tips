# SQL Injection
## What is SQL Injection
Many large servers use databases instead of json or yaml to store player information

An SQL Injection happens when a user-controlled input is placed directly into a SQL query

### Example code:
```java
String teamName = team.getName();
String query = "SELECT * FROM teams WHERE name = '" + teamName + "'";
```
If a player sets the team name to something like:
```SQL
' OR '1'='1
```
This will turn the query into something that will match every row

note: this is rare in plugins

## Examples of exploits
- [BetterTeams](https://dupedb.net/exploit/yWjYugMFO4M) had a SQL Injection exploit that let you edit anyones stored team data, including balance
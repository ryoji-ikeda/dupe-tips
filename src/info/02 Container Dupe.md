# Container Dupe
## What is Container Dupe
Container Dupe is usually one of the first things you think of when duping, you put an item into a container i.e. a chest or any other ui like an sellgui and you take two out

### Common causes
- Multiple instances of the same ui opened by different players i.e. if both players can access the same vault and it doesnt have live updates
- Improper handling of edge cases i.e. disconnects, deaths or teleportation use
- Saving contaners asynchronously without proper ordering

## Examples of exploits
- [Enderchest Skript](https://dupedb.net/exploit/BRBk8_4s7L9) had a container dupe to do with the `/ec` command
- [Vaults](https://dupedb.net/exploit/RRzmfSZUVay) had a container dupe
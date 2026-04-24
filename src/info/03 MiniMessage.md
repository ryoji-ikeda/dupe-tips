# MiniMessage Injection
## What is MiniMessage Injection

Minimessage injection is a vulnerability in many minecraft plugins that use the MiniMessage text format

It is similar to Cross-site scripting (XSS) in web development

MiniMessage allows developers to include interactive components in chat messages using tags such as:
- `<click:run_command>`
- `<hover:show_text>`
- `<insert>`
- `<open_url>`

However, sometimes plugins do not sanitize user controlled stings and players can inject malicious tags, theese tags may cause players to run commands without them wanting to run them, i.e. `/pay <yourname> 200`

## Examples of exploits
- [Homestead](https://dupedb.net/exploit/2WMth5rSCJx) had a minimessage explot that allows you to inject any minimessage payload into a region chat
- [NameTag](https://dupedb.net/exploit/jVPtq3pxqVO) had a minimessage explot that allows you to inject some minimessage payloads into a username providing it doesnt have 
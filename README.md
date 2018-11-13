### About

Simple VK chat bot based on [node-vk-bot-api](https://github.com/node-vk-bot-api/node-vk-bot-api).
![Screenshot](/screenshot.jpg)

### Installation

Rename `example_config.json` to `config.json` and paste your configuration data in there

```sh
npm install
npm install -g pm2
pm2 start index.js --name bot
pm2 save
pm2 startup
```

#### How to get vk access token

- Log in vk with your bot

- Change **[app_id]** on your application id in link and open -

https://oauth.vk.com/authorize?client_id=[app_id]&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,docs,audio,photos&response_type=token&v=5.87

#### Hot to add new command

- Create new `.js` file in `commands` directory and export function from that file which receives ctx value([more about commands](https://github.com/node-vk-bot-api/node-vk-bot-api))
- Copy-paste `botCommand(command, filename)` or `botHears(command, filename)` in `vkbot.js` file. Example: `botCommand('!help', 'help')`

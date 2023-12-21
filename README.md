# Discord Bot

This Discord bot is built using [discord.js v14](https://discord.js.org/#/docs/main/stable/general/welcome), a powerful library to interface with the Discord API. It features slash commands and can be easily extended with additional functionality.

## Features

- Slash commands implementation
- Global command deployment
- Latency measurement with embedded responses in Russian language
- Image generation via Stable Diffusion XL (thanks to [VisionCraft](https://t.me/visioncraft_channel))
- `.env` file environment variable configuration

## Getting Started

To get started with this bot, follow these instructions:

### Prerequisites

- Node.js v16.x or higher
- A Discord account and a registered Discord bot
- A server (guild) where you have administrative privileges to add and test the bot

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fedyacpp/another-discord-bot.git
   cd discord-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your environment variables**

   Add your Discord Token, Client Id and [VisionCraft](https://t.me/visioncraft_channel) API key to `.env` file:

   ```plaintext
   DISCORD_TOKEN=your-bot-token
   DISCORD_CLIENT_ID=your-bot-client-id
   DIFFUSION_API_KEY=your-visioncraft-key
   ```

4. **Deploy the commands**

   You can deploy commands globally or to a specific guild. For development, it's recommended to deploy to a single guild for faster updates. In this case commands updates globally.

   ```bash
   node deploy-commands.js
   ```

### Running the bot

If you still haven't deployed commands, do it by running following piece of code, else skip this step:

```bash
node deploy-commands.js
```

To start the bot, run the following command in your terminal:

```bash
node index.js
```

The bot should now be online and ready to receive commands. Test it by typing `/ping` in any server the bot has been added to.

When new command added, you'll need to 

```bash
node deploy-commands.js
```

everytime, so your slash commands will be registered in Discord.

## Contributing

Contributions are welcome! Feel free to open a pull request or an issue if you have ideas for improvements or have found a bug.

## License

This bot is released under the [MIT License](LICENSE).

## Acknowledgements

- [Discord.js Guide](https://discordjs.guide/)
- [Discord API Documentation](https://discord.com/developers/docs/intro)
- All contributors who participate in the development and improvement of this bot

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fileSystem = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.commands = new Collection();

const commandFiles = fileSystem.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  discordClient.commands.set(command.data.name, command);
}

const eventFiles = fileSystem.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
}

const userHistory = {};
const userTokens = {};

async function tokenizeUserMessages(userId) {
  if (!userHistory.hasOwnProperty(userId)) {
    userHistory[userId] = [{
      role: "system",
      content: `You are ${discordClient.user.username}, a Discord bot created to be a helpful assistant or a good conversational partner, depending on how you interact. Remember to use Discord markdown syntax for text formatting.`
    }];
  }
  
  try {
    const response = await axios.post('https://api.naga.ac/v1/chat/tokenizer', {
      model: "gpt-4",
      messages: userHistory[userId],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NAGA_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && typeof response.data.total === "number") {
      userTokens[userId] = (userTokens[userId] || 0) + response.data.total;
    } else {
      console.error("Unexpected response structure:", response.data);
    }

    console.log(`Total tokens for user ${userId}: ${userTokens[userId]}`);
  } catch (error) {
    console.error('Error while tokenizing messages:', error);
  }
}

async function checkUserMessageLength(userId) {
  const maxTokens = 3900; //МИНИМАЛЬНОЕ ЗНАЧЕНИЕ ИЗ ВСЕХ ПРЕДЛОЖЕННЫХ, ДЛЯ ЛУЧШЕЙ РАБОТЫ ПРОВЕРЬТЕ "context size" ДЛЯ ВАШЕЙ МОДЕЛИ
  if (userTokens[userId] > maxTokens) {
    userHistory[userId] = userHistory[userId].slice(2);
  }
}

async function handleMessage(message, selectedChannelId, selectedModel) {
  const userId = message.author.id;
  const model = selectedModel; //МОЖЕТЕ ВЫБРАТЬ ЛЮБУЮ ДОСТУПНУЮ МОДЕЛЬ ЧЕРЕЗ АПИ, ОДНАКО В САМОМ БОТЕ СПИСОК ТЕХ МОДЕЛЕЙ, КОТОРЫЕ 100 ПРОЦЕНТНО АДЕКВАТНО РАБОТАЮТ

  if (message.channel.id !== selectedChannelId) {
    return;
  }

  userHistory[userId] = (userHistory[userId] || [{role: "system", content: `You are ${discordClient.user.username}, a Discord bot created to be a helpful assistant or a good conversational partner, depending on how you interact. Remember to use Discord markdown syntax for text formatting.`}]).concat({
    role: 'user',
    content: message.content,
  });

  await tokenizeUserMessages(userId);
  await checkUserMessageLength(userId);

  try {
    const response = await axios.post('https://api.naga.ac/v1/chat/completions', {
      messages: userHistory[userId],
      model: model,
      temperature: 0.7,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.NAGA_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const replyContent = response.data.choices[0].message.content;
    userHistory[userId].push({ role: 'assistant', content: replyContent});

    await tokenizeUserMessages(userId);
    await checkUserMessageLength(userId);

    const embedMessage = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`Ответ от ${model}`)
      .setDescription(replyContent)
      .setFooter({ text: `Специально для ${message.author.username}` });

    await message.channel.send({ embeds: [embedMessage] });
  } catch (error) {
    console.error('Error while making API request:', error);
  }
}

discordClient.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const settingsContent = fileSystem.readFileSync('settings.json', 'utf8');
    const settings = JSON.parse(settingsContent);
    const guildSettings = settings[message.guildId];
    
    if (guildSettings) {
      const selectedChannelId = guildSettings.channelId;
      const selectedModel = guildSettings.aiModel || 'llama-2-70b-chat';

      if (selectedChannelId) {
        await handleMessage(message, selectedChannelId, selectedModel);
      }
    }
  } catch (error) {
    console.error('Ошибка при чтении файла "settings.json":', error);
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
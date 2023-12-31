# Discord Бот

Склепал я этого бота с помощью [discord.js v14](https://discord.js.org/#/docs/main/stable/general/welcome) – крутая тема для связи с Discord API. Такая вот палочка-выручалочка с кучей возможностей, расширять функционал - просто раз плюнуть.

## Что он умеет?

- Щелкает слеш-командами как орешки
- Измеряет твою терпеливость (пинг) и отвечает по-русски
- Ваяет картинки через Stable Diffusion XL (спасибо, [VisionCraft](https://t.me/visioncraft_channel))
- Общается с тобой в выделенном текстовом канале благодаря [NagaAI](https://discord.naga.ac)
- Жонглирует переменными окружения в файлике `.env`

## Как начать

Если хочешь приручить этого зверька, то тебе сюда:

### Что нужно иметь:
- Node.js v16.x и выше под боком
- Дискорд акаунт и зареганного бота (да, без шуток)
- Серверок (гильдию), где ты крутой админ, чтобы добавить и потестить бота

### Первые шаги

1. **Подселяй репозиторий**

   ```bash
   git clone https://github.com/fedyacpp/another-discord-bot.git
   cd discord-bot
   ```

2. **Ставь зависимости**

   ```bash
   npm install
   ```

3. **Настрой свои переменные окружения**

   Кинь в файлик `.env` свои секретики – токен дискорда, ID клиента, ключик API для [VisionCraft](https://t.me/visioncraft_channel) и [NagaAI](https://discord.naga.ac):

   ```plaintext
   DISCORD_TOKEN=your-bot-token
   DISCORD_CLIENT_ID=your-bot-client-id
   DIFFUSION_API_KEY=your-visioncraft-key
   NAGA_API_TOKEN=your-naga-key
   ```

4. **Развертывание команд**

   Зарегистрируй свои слеш команды где душе угодно: по всему миру или для конкретной гильдии. Для разрабов - регистрируйте на одной гильдии, ибо быстрее. В моём исполнении команды регаются глобально.

   ```bash
   node deploy-commands.js
   ```

### Запускаем бота

Если ты еще не зарегал команды, беги и выполни код:

```bash
node deploy-commands.js
```

А теперь чтоб оживить бота, гони в терминал:

```bash
node index.js
```

Вот теперь он живой! Проверь написав `/ping` на любом сервере, где бот в гостях.

Если новые команды наплодишь, не забывай кормить их в дискорд:

```bash
node deploy-commands.js
```

А то они там в игнор могут уйти.

## Внимание

Пока что функционал в /settings реализован НЕ ВЕСЬ!

Stable Diffusion XL от VisionCraft смазанный как Пикассо на вечеринке, че за фигня – не ведаю, то ли провайдер накосячил, то ли SD через одно место. Да и ладно, картинки то рисует!

![image](https://github.com/fedyacpp/another-discord-bot/assets/125286674/713afce2-585d-4634-b947-42e5b29efc51)
![JAXtmYB](https://github.com/fedyacpp/another-discord-bot/assets/125286674/f38007de-bf3d-46a7-ad49-e10377788ff9)

## Помощь в проекте

Руки помощи всегда в цене! Если есть идеи или нашел баг, кидай pull request или свисти в issue.

## Лицуха

Этого бота мы отпускаем на волю по [лицензии MIT](LICENSE).

## Благодарности и поклоны

- [Руководство по Discord.js](https://discordjs.guide/) – за знания
- [Документация Discord API](https://discord.com/developers/docs/intro) – за мудрость
- Всем, кто кодил и улучшал – респект и уважуха!

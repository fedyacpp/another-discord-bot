const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SelectMenuBuilder
} = require('discord.js');
const fs = require('fs');
const settingsPath = './settings.json';

const modelOptions = {
  "gpt-4-0613": { label: "GPT-4 0613", description: "Платная модель", value: "gpt-4-0613", category: "paid" },
  "gpt-4-1106-preview": { label: "GPT-4 1106 Preview", description: "Платная модель", value: "gpt-4-1106-preview", category: "paid" },
  "gpt-3.5-turbo": { label: "GPT-3.5 Turbo", description: "Бесплатная модель", value: "gpt-3.5-turbo", category: "free" },
  "gpt-3.5-turbo-1106": { label: "GPT-3.5 Turbo 1106", description: "Бесплатная модель", value: "gpt-3.5-turbo-1106", category: "free" },
  "gpt-3.5-turbo-0613": { label: "GPT-3.5 Turbo 0613", description: "Бесплатная модель", value: "gpt-3.5-turbo-0613", category: "free" },
  "mixtral-8x7b": { label: "Mixtral 8x7b", description: "Бесплатная модель", value: "mixtral-8x7b", category: "free" },
  "llama-2-70b-chat": { label: "LLaMA 2 70B Chat", description: "Бесплатная модель", value: "llama-2-70b-chat", category: "free" },
};

function getSettings(guildId) {
  if (!fs.existsSync(settingsPath)) {
    return {};
  }

  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  return settings[guildId] || {};
}

function saveSettings(guildId, settings) {
  const allSettings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, 'utf8')) : {};
  allSettings[guildId] = settings;
  fs.writeFileSync(settingsPath, JSON.stringify(allSettings, null, 2), 'utf8');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Настройте бота под свои нужды')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const saveChannelButton = new ButtonBuilder()
      .setCustomId('save_channel')
      .setLabel('Сохранить канал')
      .setStyle(ButtonStyle.Primary);

    const deleteChannelButton = new ButtonBuilder()
      .setCustomId('delete_channel')
      .setLabel('Удалить канал')
      .setStyle(ButtonStyle.Danger);

    const selectModelButton = new ButtonBuilder()
      .setCustomId('select_model')
      .setLabel('Выбрать модель')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(
      saveChannelButton, deleteChannelButton, selectModelButton
    );

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Настройки бота')
      .setDescription('Выберите опцию');

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });

    const filter = (compInteraction) => ['save_channel', 'delete_channel', 'select_model'].includes(compInteraction.customId) && compInteraction.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'save_channel') {
        const modal = new ModalBuilder()
          .setCustomId('channel_modal')
          .setTitle('Выбор канала для бота')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('channel_input')
                .setLabel('Укажите ID канала')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );

        await buttonInteraction.showModal(modal);

        const modalInteraction = await buttonInteraction.awaitModalSubmit({ time: 30000 }).catch(console.error);
        
        if (modalInteraction) {
          const channelInput = modalInteraction.fields.getTextInputValue('channel_input');
          const channelId = channelInput.trim();
        
          try {
            const settings = getSettings(modalInteraction.guildId);
            settings.channelId = channelId;
            saveSettings(modalInteraction.guildId, settings);

            await modalInteraction.reply({ 
              content: `Канал для ответов бота сохранен: <#${channelId}>.`,
              ephemeral: true
            });
          } catch (error) {
            console.error('Error saving channel settings: ', error);
            await modalInteraction.reply({
              content: 'Произошла ошибка при сохранении настроек канала.',
              ephemeral: true
            });
          }
        } else {
          await buttonInteraction.followUp({
            content: 'Время ожидания ответа истекло. Пожалуйста, попробуйте снова.',
            ephemeral: true
          });
        }

      } else if (buttonInteraction.customId === 'delete_channel') {
        const settings = getSettings(buttonInteraction.guildId);
        if (settings.channelId) {
          delete settings.channelId;
          saveSettings(buttonInteraction.guildId, settings);
          await buttonInteraction.reply({
            content: 'Настройки канала удалены.',
            ephemeral: true
          });
        } else {
          await buttonInteraction.reply({
            content: 'Настройки канала не найдены.',
            ephemeral: true
          });
        }

      } else if (buttonInteraction.customId === 'select_model') {
        await buttonInteraction.reply({
          content: 'Выберите модель AI из списка:',
          components: [
            new ActionRowBuilder().addComponents(
              new SelectMenuBuilder()
                .setCustomId('model_select')
                .setPlaceholder('Выберите модель AI')
                .addOptions(Object.values(modelOptions).map(option => ({
                  label: option.label,
                  description: option.description,
                  value: option.value
                })))
            )
          ],
          ephemeral: true
        });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: 'Время ожидания истекло. Попробуйте настроить бота снова.',
          components: []
        });
      }
    });
  },
};

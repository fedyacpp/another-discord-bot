const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Отображает задержку между сервером и пользователем.'),

  async execute(interaction) {
    await interaction.deferReply();

    const roundTripLatency = Date.now() - interaction.createdTimestamp;

    const apiLatency = Math.round(interaction.client.ws.ping);

    const latencyEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('🏓 Пинг')
      .addFields(
        { name: 'Задержка бота', value: `${roundTripLatency}мс`, inline: true },
        { name: 'Задержка API', value: `${apiLatency}мс`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Запрос от ${interaction.user.username}` });

    await interaction.editReply({ embeds: [latencyEmbed] });
  },
};
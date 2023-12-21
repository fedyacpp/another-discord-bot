const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('diffuse-xl')
    .setDescription('Генерация изображений с помощью Stable Diffusion XL.')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Текстовое описание изображения.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('image_count')
        .setDescription('Количество генерируемых изображений (максимум 2).')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('height')
        .setDescription('Высота изображения (минимум 64, максимум 1024).')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('width')
        .setDescription('Ширина изображения (минимум 64, макисмум 1024).')
        .setRequired(false)),

        async execute(interaction) {
          await interaction.deferReply();
      
          const prompt = interaction.options.getString('prompt');
          const imageCount = interaction.options.getInteger('image_count') || 1;
          const height = interaction.options.getInteger('height') || 768;
          const width = interaction.options.getInteger('width') || 1024;
          const token = process.env.DIFFUSION_API_KEY;
      
          axios.post('https://visioncraftapi--vladalek05.repl.co/generate-xl', {
            model: 'sdxl-turbo',
            prompt: prompt,
            image_count: imageCount,
            token: token,
            height: height,
            width: width
          }, {
            responseType: 'arraybuffer'
          }).then(async response => {
            const responseData = JSON.parse(response.data.toString());
            const imageUrl = responseData.images[0];
          
            const embed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle('Изображение готово!')
              .setDescription(`Промпт: "${prompt}"`)
              .setImage(imageUrl)
              .setFooter({ text: `Специально для ${interaction.user.tag}` });
          
            await interaction.editReply({ embeds: [embed] });
          }).catch(error => {
            console.error('Error generating images:', error);
            let errorMessage = 'Произошла ошибка при генерации изображения.';
          
            if (error.response && error.response.status) {
              errorMessage += ` Код ошибки: ${error.response.status}`;
            }
          
            interaction.editReply(errorMessage);
          });
        }
      }
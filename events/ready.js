const fs = require('fs');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      const permissions = '30781964549367';
      const clientId = client.user.id;
      const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
      let delay = 1000;
      let booting;

      if (commandFiles.length === 0) {
        booting = 'No commands found';
      } 
      if (commandFiles.length === 1) {
        booting = `Booting with ${commandFiles.length} command`;
      }
      if (commandFiles.length >= 2) {
        booting = `Booting with ${commandFiles.length} commands`;
      }

      console.log(booting);
      setTimeout(() => {console.log(`Ready! Logged in as ${client.user.tag}`)}, delay);
      setTimeout(() => {console.log(`Invite me to your server: ${inviteLink}`)}, delay);
    },
  };
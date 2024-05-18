require('dotenv').config();
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});

const verify = '1054474357411426505';
const unadd = '1145402487684223116';
const only = '1145397830639427614';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.channel.id !== only) return;
  
  if (message.content === '!verify') {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Verification')
      .setDescription('Make sure you read the rules, there\'s a hidden word in rules that you need to input for you to get verified.\n\nHint: Main Rules in <id:home>\n\nPlease click the button below to verify.');

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('verify')
        .setLabel('Verify')
        .setStyle('PRIMARY')
    );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  if (interaction.isButton()) {
    if (interaction.customId === 'verify') {
      const modal = new Modal()
        .setCustomId('verificationModal')
        .setTitle('Verification')
        .addComponents(
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('verification')
              .setLabel('Enter the verification word')
              .setStyle('SHORT')
          )
        );

      await interaction.showModal(modal);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'verificationModal') {
      const verification = interaction.fields.getTextInputValue('verification');

      if (verification.toLowerCase() === 'heehaw') {
        const verificationRole = interaction.guild.roles.cache.get(verify);
        const roleToRemove = interaction.guild.roles.cache.get(unadd);
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (verificationRole && roleToRemove) {
          await member.roles.add(verificationRole);
          await member.roles.remove(roleToRemove);
          await interaction.reply({ content: `You have been verified and given the role!`, ephemeral: true });
        } else {
          await interaction.reply({ content: `Something went wrong.`, ephemeral: true });
        }
      } else {
        await interaction.reply({ content: `Wrong verification word`, ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
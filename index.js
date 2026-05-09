const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const ROLE_ID = "1502116113192845382";
const CHANNEL_ID = "1502120027778977882";

client.once(Events.ClientReady, async (client) => {
  console.log(`bot iniciado como ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      return console.log("❌ no se encontró el canal");
    }

    console.log("canal encontrado:", channel.name);

    const embed = new EmbedBuilder()
      .setTitle("verificación requerida")
      .setDescription("haz clic en el botón para verificarte y obtener acceso al servidor.")
      .setColor(0x2b2d31);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify")
        .setLabel("verificarme")
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("mensaje de verificación enviado ✔");

  } catch (err) {
    console.error("❌ ERROR ENVIANDO MENSAJE:", err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verify") {
    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);

      if (member.roles.cache.has(ROLE_ID)) {
        return interaction.reply({
          content: "ya estás verificado ✔",
          flags: 64
        });
      }

      await member.roles.add(ROLE_ID);

      return interaction.reply({
        content: "te has verificado correctamente ✔",
        flags: 64
      });

    } catch (err) {
      console.error(err);

      if (!interaction.replied) {
        interaction.reply({
          content: "ocurrió un error al verificarte ❌",
          flags: 64
        });
      }
    }
  }
});

client.login(process.env.TOKEN);
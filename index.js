const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require("discord.js");

require("dotenv").config();

const CHANNEL_ID = "1502120027778977882";
const ROLE_NAME = "unknownVerify";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

/* =========================
   READY
========================= */
client.once(Events.ClientReady, async (c) => {
  console.log(`bot iniciado como ${c.user.tag}`);
  console.log("🔥 VERIFICATION SYSTEM ONLINE");

  try {
    const channel = await c.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log("❌ canal no encontrado");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("verificación requerida")
      .setDescription("haz clic en el botón para verificarte y acceder al servidor.")
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
    console.error("error en ready:", err);
  }
});

/* =========================
   INTERACCIONES
========================= */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verify") {
    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);

      const role = interaction.guild.roles.cache.find(
        r => r.name === ROLE_NAME
      );

      if (!role) {
        return interaction.reply({
          content: "❌ no existe el rol unknownVerify",
          flags: 64
        });
      }

      if (member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: "ya estás verificado ✔",
          flags: 64
        });
      }

      await member.roles.add(role);

      return interaction.reply({
        content: "te has verificado correctamente ✔",
        flags: 64
      });

    } catch (err) {
      console.error("error verificación:", err);

      if (!interaction.replied) {
        interaction.reply({
          content: "error al verificarte ❌",
          flags: 64
        });
      }
    }
  }
});

/* =========================
   LOGIN
========================= */
client.login(process.env.TOKEN);
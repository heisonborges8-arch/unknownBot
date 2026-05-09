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

const CHANNEL_ID = "1502120027778977882";
const ROLE_ID = "1502116113192845382"; // unknownVerify

let cachedRole = null;

/* =========================
   READY
========================= */
client.once(Events.ClientReady, async (c) => {
  console.log(`bot iniciado como ${c.user.tag}`);

  try {
    const guild = c.guilds.cache.first();

    if (!guild) {
      console.log("❌ no hay servidor en cache");
      return;
    }

    // 🔎 detectar rol por ID desde el servidor
    cachedRole = guild.roles.cache.get(ROLE_ID);

    if (!cachedRole) {
      console.log("❌ rol unknownVerify no encontrado");
    } else {
      console.log("rol detectado ✔:", cachedRole.name);
    }

    const channel = await c.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log("❌ canal no encontrado");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("verificación requerida")
      .setDescription("haz clic en el botón para verificarte y obtener acceso.")
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

    console.log("mensaje enviado ✔");

  } catch (err) {
    console.error("error en ready:", err);
  }
});

/* =========================
   BOTÓN
========================= */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verify") {
    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);

      const role = cachedRole || interaction.guild.roles.cache.get(ROLE_ID);

      if (!role) {
        return interaction.reply({
          content: "❌ rol unknownVerify no existe",
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
      console.error("error en verificación:", err);

      if (!interaction.replied) {
        interaction.reply({
          content: "ocurrió un error al verificarte ❌",
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
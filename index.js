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
const OWNER_ROLE = "unknownOwner";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

/* =========================
   CHECK OWNER
========================= */
function isOwner(interaction) {
  return interaction.member.roles.cache.some(
    r => r.name === OWNER_ROLE
  );
}

/* =========================
   READY
========================= */
client.once(Events.ClientReady, async (c) => {
  console.log(`bot iniciado como ${c.user.tag}`);
  console.log("🔥 VERIFICATION SYSTEM ONLINE");

  try {
    const channel = await c.channels.fetch(CHANNEL_ID);

    if (!channel) return console.log("❌ canal no encontrado");

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

  if (!interaction.isChatInputCommand()) return;

  /* ================= CLEAR ================= */
  if (interaction.commandName === "clear") {

    if (!isOwner(interaction)) {
      return interaction.reply({
        content: "❌ Solo unknownBot puede usar esto.",
        flags: 64
      });
    }

    const cantidad = interaction.options.getInteger("cantidad");

    if (cantidad < 1 || cantidad > 100) {
      return interaction.reply({
        content: "❌ Debe ser entre 1 y 100.",
        flags: 64
      });
    }

    try {
      await interaction.channel.bulkDelete(cantidad, true);

      return interaction.reply({
        content: `🗑️ Se eliminaron ${cantidad} mensajes.`,
        flags: 64
      });

    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "❌ Error al borrar mensajes.",
        flags: 64
      });
    }
  }

  /* ================= LOCK ================= */
  if (interaction.commandName === "lock") {

    if (!isOwner(interaction)) {
      return interaction.reply({ content: "❌ Solo unknownBot puede usar esto.", flags: 64 });
    }

    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: false }
    );

    return interaction.reply({ content: "🔒 Canal bloqueado", flags: 64 });
  }

  /* ================= UNLOCK ================= */
  if (interaction.commandName === "unlock") {

    if (!isOwner(interaction)) {
      return interaction.reply({ content: "❌ Solo unknownBot puede usar esto.", flags: 64 });
    }

    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: true }
    );

    return interaction.reply({ content: "🔓 Canal desbloqueado", flags: 64 });
  }

  /* ================= EMBED ================= */
  if (interaction.commandName === "embed") {

    if (!isOwner(interaction)) {
      return interaction.reply({ content: "❌ Solo unknownBot puede usar esto.", flags: 64 });
    }

    const titulo = interaction.options.getString("titulo");
    const descripcion = interaction.options.getString("descripcion");

    const embed = new EmbedBuilder()
      .setTitle(titulo)
      .setDescription(descripcion)
      .setColor(0x2b2d31);

    return interaction.reply({ embeds: [embed] });
  }

  /* ================= POLL ================= */
  if (interaction.commandName === "poll") {

    if (!isOwner(interaction)) {
      return interaction.reply({ content: "❌ Solo unknownBot puede usar esto.", flags: 64 });
    }

    const pregunta = interaction.options.getString("pregunta");

    const msg = await interaction.reply({
      content: `📊 **Encuesta:** ${pregunta}`,
      fetchReply: true
    });

    await msg.react("👍");
    await msg.react("👎");
  }
});

/* =========================
   VERIFY BUTTON
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
   BOOSTERS
========================= */
const BOOSTER_ROLE = "unknownBooster";

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {

    if (!oldMember.premiumSince && newMember.premiumSince) {

      const boosterRole = newMember.guild.roles.cache.find(
        r => r.name === BOOSTER_ROLE
      );

      if (!boosterRole) return;

      if (!newMember.roles.cache.has(boosterRole.id)) {
        await newMember.roles.add(boosterRole);

        const channel = newMember.guild.channels.cache.get("1502827868218986527");

        if (channel) {
          channel.send(`🚀 ${newMember.user} acaba de boostear el servidor`);
        }
      }

      console.log(`${newMember.user.tag} recibió unknownBooster ✔`);
    }

  } catch (err) {
    console.error("error booster:", err);
  }
});

/* =========================
   LOGIN
========================= */
client.login(process.env.TOKEN);
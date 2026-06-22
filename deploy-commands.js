const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [

  // /clear
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra mensajes")
    .addIntegerOption(option =>
      option
        .setName("cantidad")
        .setDescription("Cantidad de mensajes a borrar")
        .setRequired(true)
    ),

  // /lock
  new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Bloquea el canal actual"),

  // /unlock
  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Desbloquea el canal actual"),

  // /embed
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Envía un embed personalizado")
    .addStringOption(option =>
      option.setName("titulo")
        .setDescription("Título del embed")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("descripcion")
        .setDescription("Descripción del embed")
        .setRequired(true)
    ),

  // /poll
  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Crear una encuesta")
    .addStringOption(option =>
      option.setName("pregunta")
        .setDescription("Pregunta de la encuesta")
        .setRequired(true)
    )

].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Comandos registrados");
  } catch (error) {
    console.error(error);
  }
})();
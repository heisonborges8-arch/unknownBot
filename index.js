const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    Events 
} = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

// bot listo
client.once('ready', () => {
    console.log(`bot iniciado como ${client.user.tag}`);
});

// comando para enviar el mensaje de verificación
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!setupverify') {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('verificarse')
                    .setStyle(ButtonStyle.Success)
            );

        await message.channel.send({
            content: 
`👋 bienvenido al servidor

para acceder a todos los canales debes verificarte

pulsa el botón de abajo 👇`,
            components: [row]
        });
    }
});

// sistema del botón (ARREGLADO)
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify_button') {

        try {
            const role = interaction.guild.roles.cache.find(r => r.name === 'verificado');

            if (!role) {
                return interaction.reply({
                    content: '❌ no existe el rol "verificado"',
                    ephemeral: true
                });
            }

            if (!interaction.member) {
                return interaction.reply({
                    content: '❌ no se pudo obtener el usuario',
                    ephemeral: true
                });
            }

            await interaction.member.roles.add(role);

            return interaction.reply({
                content: '✔ te has verificado correctamente',
                ephemeral: true
            });

        } catch (err) {
            console.log(err);

            return interaction.reply({
                content: '❌ ocurrió un error al verificarte',
                ephemeral: true
            });
        }
    }
});

// login
client.login(process.env.TOKEN);
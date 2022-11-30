const { token } = require('./config.json');
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
const fs = require('fs')
const path = require('node:path');
const deploycommands = require('./deploy-commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

async function dataSave(Dungeondata, name) {
    const datastr = JSON.stringify(Dungeondata, null, '\t');
    fs.writeFileSync(`./${name}.json`, datastr);
}

function makeRandom(min, max){
    var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
    return RandVal;
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    console.log('MinigameBot is Ready! dev by ABELA')
})

client.on('interactionCreate', async interaction => {

    if (interaction.customId === 'ChallengeReg') {
        //DB.json 불러오기
		var jsonBuffer = fs.readFileSync('DB.json')
		var dataJson = jsonBuffer.toString();
		var DB = JSON.parse(dataJson);

        const title = interaction.fields.getTextInputValue('title');
	    const content = interaction.fields.getTextInputValue('content');
        const period = Number(interaction.fields.getTextInputValue('period'));
	    const condition = Number(interaction.fields.getTextInputValue('condition'));
        const congratulationMessage = interaction.fields.getTextInputValue('congratulationMessage');

        DB.Challenge.challengeTitle = title
        DB.Challenge.challengeContent = content
        DB.Challenge.period = period
        DB.Challenge.condition = condition
        DB.Challenge.congratulationMessage = congratulationMessage

        dataSave(DB, 'DB')

		const embed = new EmbedBuilder()
            .setTitle(`🎉 \`${title}\` 챌린지가 성공적으로 등록 되었습니다!`)
            .addFields(
                { name: '기간', value: `${period}일`, inline: true  },
                { name: '이수 조건', value: `${condition}번 이상 인증`, inline: true  }
            )
            .setColor("#4B7EE3")
        interaction.reply({ embeds: [embed] })

        const Anchannel = interaction.guild.channels.cache.get(DB.Announcement_Channel)

        const embed2 = new EmbedBuilder()
            .setTitle(`새로운 챌린지 \`${title}\` 가 시작 되었습니다!`)
            .addFields(
                { name: '내용', value: `${content}`, inline: true  },
                { name: '기간', value: `${period}일`, inline: true  },
                { name: '이수 조건', value: `${condition}번 이상 인증`, inline: true  }
            )
            .setColor("#4B7EE3")
        Anchannel.send({ embeds: [embed2]})
	}

    if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '명령어 처리중 오류가 발생했습니다!', ephemeral: true });
	}
});

client.login(token);
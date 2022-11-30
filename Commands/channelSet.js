const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, italic, EmbedBuilder, channelLink, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { guildId } = require('../config.json');
const fs = require('fs');

async function dataSave(Dungeondata, name) {
    const datastr = JSON.stringify(Dungeondata, null, '\t');
    fs.writeFileSync(`./${name}.json`, datastr);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공지채널등록')
		.setDescription('공지채널을 등록합니다')
        .addChannelOption(option => 
            option.setName('공지채널')
            .setDescription('공지채널을 선택합니다')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        //DB.json 불러오기
		var jsonBuffer = fs.readFileSync('DB.json')
		var dataJson = jsonBuffer.toString();
		var DB = JSON.parse(dataJson);

        const channel = interaction.options._hoistedOptions[0]

        DB.Announcement_Channel = channel.value

        dataSave(DB, 'DB')

        interaction.reply(`챌린지 공지 채널을 ${channel.channel} 으로 등록 하였습니다`)
    }
}
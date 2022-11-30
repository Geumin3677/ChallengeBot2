const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, italic, EmbedBuilder, channelLink, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { guildId } = require('../config.json');
const fs = require('fs');

async function dataSave(Dungeondata, name) {
    const datastr = JSON.stringify(Dungeondata, null, '\t');
    fs.writeFileSync(`./${name}.json`, datastr);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('챌린지등록')
		.setDescription('새 챌린지를 등록합니다')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        // Create the modal
        const modal = new ModalBuilder()
        .setCustomId('ChallengeReg')
        .setTitle('새 챌린지 등록');

        // Add components to modal

        // Create the text input components
        const title = new TextInputBuilder()
            .setCustomId('title')
            .setLabel("챌린지 제목")
            .setStyle(TextInputStyle.Short);

        const content = new TextInputBuilder()
            .setCustomId('content')
            .setLabel("챌린지 내용")
            .setStyle(TextInputStyle.Paragraph);

        const period = new TextInputBuilder()
            .setCustomId('period')
            .setLabel("기간 **정수로 작성**")
            .setStyle(TextInputStyle.Short);

        const condition = new TextInputBuilder()
            .setCustomId('condition')
            .setLabel("이수 조건 **정수로 작성**")
            .setStyle(TextInputStyle.Short);

        const congratulationMessage = new TextInputBuilder()
            .setCustomId('congratulationMessage')
            .setLabel("축하 메시지")
            .setStyle(TextInputStyle.Paragraph);

        const Row1 = new ActionRowBuilder().addComponents(title);
        const Row2 = new ActionRowBuilder().addComponents(content);
        const Row3 = new ActionRowBuilder().addComponents(period);
        const Row4 = new ActionRowBuilder().addComponents(condition);
        const Row5 = new ActionRowBuilder().addComponents(congratulationMessage);

        // Add inputs to the modal
        modal.addComponents(Row1, Row2, Row3, Row4, Row5);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}
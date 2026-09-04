const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const scheduleData = require('./data/schedule.json');

const TIMEZONE = 'Asia/Jakarta';

function getJakartaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);

    return Object.fromEntries(parts
        .filter(({ type }) => type !== 'literal')
        .map(({ type, value }) => [type, value]));
}

function getTodaySchedule(date = new Date()) {
    const dateParts = getJakartaDateParts(date);
    return {
        dateParts,
        dungeon: scheduleData[String(Number(dateParts.day))]
    };
}

function createMessage(date = new Date()) {
    const { dateParts, dungeon } = getTodaySchedule(date);
    if (!dungeon) return null;

    return [
        'Pagi lorem ipsum dolor sit amet!',
        '',
        `Jadwal Dungeon hari ini (${dateParts.day}/${dateParts.month}/${dateParts.year}):`,
        `Level 65: ${dungeon.lvl65}`,
        `Level 70: ${dungeon.lvl70}`,
        '',
        'Jangan lupa habiskan tiket run kalian sebelum reset harian!'
    ].join('\n');
}

function createEmbed(date = new Date()) {
    const { dateParts, dungeon } = getTodaySchedule(date);
    if (!dungeon) return null;

    const formattedDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
    const embed = new EmbedBuilder()
        .setColor(0x19d3c5)
        .setTitle('🧱 Lucky Zone Tudei')
        .setDescription(`date: ${formattedDate}`)
        .addFields(
            { name: '🏰 Lv 65 Dungeon', value: dungeon.lvl65, inline: true },
            { name: '🏰 Lv 70 Dungeon', value: dungeon.lvl70, inline: true }
        )
        .setFooter({
            text: `Dishonored Notifier • ${formattedDate}`
        });

    if (process.env.DUNGEON_THUMBNAIL_URL) {
        embed.setThumbnail(process.env.DUNGEON_THUMBNAIL_URL);
    }

    if (process.env.DUNGEON_IMAGE_URL) {
        embed.setImage(process.env.DUNGEON_IMAGE_URL);
    }

    return embed;
}

function getChannelId(value) {
    const channelId = value.trim();
    const urlMatch = channelId.match(/\/channels\/\d+\/(\d+)\/?$/);
    return urlMatch ? urlMatch[1] : channelId;
}

async function sendTodaySchedule(client) {
    const channelId = getChannelId(process.env.CHANNEL_ID);
    let channel;

    try {
        channel = await client.channels.fetch(channelId);
    } catch (error) {
        if (error.code === 50001) {
            throw new Error('Bot tidak memiliki View Channel pada channel tujuan atau tidak berada di server tersebut.');
        }

        throw error;
    }

    if (!channel || !channel.isTextBased()) {
        throw new Error('CHANNEL_ID tidak menunjuk ke text channel yang valid.');
    }

    const embed = createEmbed();
    if (!embed) {
        console.warn('Jadwal untuk tanggal hari ini belum tersedia.');
        return;
    }

    try {
        await channel.send({ embeds: [embed] });
    } catch (error) {
        if (error.code === 50013) {
            throw new Error('Bot kekurangan izin Send Messages atau Embed Links pada channel tujuan.');
        }

        throw error;
    }

    console.log('Jadwal dungeon hari ini berhasil dikirim.');
}

function startScheduler(client) {
    cron.schedule('0 8 * * *', () => {
        sendTodaySchedule(client).catch((error) => {
            console.error('Gagal mengirim jadwal:', error.message);
        });
    }, { timezone: TIMEZONE });

    console.log('Scheduler aktif: pengiriman setiap hari pukul 08:00 WIB.');
}

if (require.main === module && process.argv.includes('--preview')) {
    console.log(createMessage() || 'Jadwal hari ini belum tersedia.');
}

module.exports = { createMessage, createEmbed, getTodaySchedule, sendTodaySchedule, startScheduler };
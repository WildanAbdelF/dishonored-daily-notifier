const cron = require('node-cron');
const scheduleData = require('./data/schedule.json');

const TIMEZONE = 'Asia/Jakarta';

function getJakartaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        month: 'long'
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
        'Pagi Pejuang Altera!',
        '',
        `Jadwal Dungeon hari ini (${dateParts.day}/${dateParts.month}/${dateParts.year}):`,
        `Level 65: ${dungeon.lvl65}`,
        `Level 70: ${dungeon.lvl70}`,
        '',
        'Jangan lupa habiskan tiket run kalian sebelum reset harian!'
    ].join('\n');
}

async function sendTodaySchedule(client) {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
        throw new Error('CHANNEL_ID tidak menunjuk ke text channel yang valid.');
    }

    const message = createMessage();
    if (!message) {
        console.warn('Jadwal untuk tanggal hari ini belum tersedia.');
        return;
    }

    await channel.send(message);
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

module.exports = { createMessage, getTodaySchedule, sendTodaySchedule, startScheduler };
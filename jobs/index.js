const { MessageMedia } = require('whatsapp-web.js');
const { phoneNumber } = require('../config.json');

const flights = new Set();

async function run(bree, client) {
	bree.start();

	bree.on('worker created', (name) => {
		bree.workers.get(name)?.on('message', async (message) => {
			const chat = await client.getChatById(phoneNumber);

			if (message.event === 'flightFound') {
				const { data } = message;
				if (flights.has(data.r)) return;

				console.log(`New Flight Found: ${data.flight.trim()} (Reg: ${data.r})`);

				try {
					const formatSpeed = (knots) => Math.round(knots * 1.852);
					const content = {
						Callsign: `${data.flight.trim()} (Registration: ${data.r})`,
						Flight: `${data.t} (${data.desc})`,
						Owner: data.ownOp ?? 'N/A',
						'Ground Speed': `${formatSpeed(data.gs)}km/h ${data.ias ?? data.tas ?? data.mach
								? `(${data.ias ? `IAS: ${formatSpeed(data.ias)}km/h` : ''} ${data.tas ? `TAS: ${formatSpeed(data.tas)}km/h` : ''} ${data.mach ? `Mach: ${data.mach}` : ''
								})`
								: ''
							}`,
						Altitude: data.alt_baro === 'ground' ? 'Ground (not flying)' : `${new Intl.NumberFormat('en-EN').format(data.alt_baro)}m`,
						Heading: `${data.true_heading ?? data.mag_heading ?? data.track}°`
					};
					const toSend = Object.entries(content)
						.map(([k, v]) => `*${k}*: ${v}`)
						.join('\n');

					chat.sendMessage(toSend, {
						media: await MessageMedia.fromUrl(data.photo)
					}).catch(() => null);

					flights.add(data.r);
				} catch (err) {
					console.log(`An error occured while sending message for flight ${data.flight}: ${err.message} `);
				}
			}
		});
	});

	bree.on('worker deleted', (name) => {
		bree.workers.get(name)?.removeAllListeners();
	});
}

module.exports = run;

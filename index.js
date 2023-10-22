const Bree = require('bree');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { resolve } = require('node:path');
const qrcode = require('qrcode-terminal');

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: {
		headless: true
	}
});

const bree = new Bree({
	logger: false,
	root: false,
	jobs: [
		{
			name: 'main',
			path: resolve('./src/jobs/main.js'),
			interval: 'every 5 seconds'
		}
	]
});

client.on('qr', (qr) => {
	qrcode.generate(qr, { small: true });
	console.log(`Please scan the above QR code to log into whatsapp`);
});
client.on('ready', () => {
	console.log(`Whatsapp Client logged in`);
	require('./jobs/index')(bree, client);
});

client.initialize();

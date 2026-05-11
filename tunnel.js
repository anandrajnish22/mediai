const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 5000, subdomain: 'mediai-api-2026' });

  console.log(`Backend is live at: ${tunnel.url}`);

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/wallpapers',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('--- BODY START ---');
    console.log(data);
    console.log('--- BODY END ---');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();

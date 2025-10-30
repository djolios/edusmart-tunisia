// working-server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Node.js يعمل بشكل مثالي!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('==========================================');
  console.log('اختبار ناجح! الخادم يعمل على http://localhost:3000');
  console.log('==========================================');
});
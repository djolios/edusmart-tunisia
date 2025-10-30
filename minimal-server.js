// minimal-server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('الخادم يعمل! لقد تم الاتصال بنجاح.');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('----------------------------------');
  console.log('الخادم البسيط يعمل على http://localhost:3000');
  console.log('----------------------------------');
  console.log('جرب فتح الرابط في المتصفح الآن.');
});
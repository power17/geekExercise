const net = require('node:net');
const Response = require('./Response')
let str = ''
const client = net.createConnection({ port: 3000 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('GET / HTTP/1.1\r\n');
  client.write('Host: 127.0.0.1\r\n');
  client.write('\r\n');
});
client.on('data', (data) => {
  str+=data.toString()
  client.end();
});
client.on('end', () => {
    // console.log(str)
    let res = new Response()
    res.parse(str)
  console.log('disconnected from server');
});
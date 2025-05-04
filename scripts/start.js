import { createServer } from 'http-server';

const server = createServer({
  root: '.',
  cache: -1,
  cors: true,
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

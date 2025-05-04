import { createServer } from 'http-server';

const server = createServer({
  root: '.',
  cache: -1,
  cors: true,
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

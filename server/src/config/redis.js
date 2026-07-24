const Redis = require('ioredis');
let client = null;
try {
  if (process.env.REDIS_URL) {
    client = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
    client.connect().catch(() => { client = null; });
  }
} catch { client = null; }
module.exports = { get client() { return client; } };

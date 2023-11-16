export const subject = process.env.NATS_SUBJECT ?? 'Lumberjack';
export const server = process.env.NATS_SERVER ?? 'localhost:4222';
export const port = process.env.PORT ?? 5000;
export default server;

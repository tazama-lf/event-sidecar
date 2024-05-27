// SPDX-License-Identifier: Apache-2.0

import 'dotenv/config';
import { createNatsConnection } from './services/nats.js';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import server, { subject, port } from './config/server.js';
import { type NatsConnection } from 'nats';
import path from 'node:path';
import { createLogBuffer } from '@frmscoe/frms-coe-lib/lib/helpers/protobuf.js';

const PROTO_PATH = path.join(
  __dirname,
  '../node_modules/@frmscoe/frms-coe-lib/lib/helpers/proto/Lumberjack.proto',
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const logProto: any = grpc.loadPackageDefinition(packageDefinition).lumberjack;
let natsConnection: NatsConnection;

const target = `0.0.0.0:${port}`;

function sendLog(call: any, callback: any): void {
  // call.request is the Log Object
  // send to NATS
  //
  const messageBuffer = createLogBuffer(
    call.request as Record<string, unknown>,
  );
  if (messageBuffer != null) {
    natsConnection.publish(subject, messageBuffer);
    console.log('published');
  } else {
    console.error('failed to encode log buffer', call);
  }

  callback();
}

function main(): void {
  console.info('starting grpc server');
  const server = new grpc.Server();
  server.addService(
    logProto.Lumberjack
      .service as grpc.ServiceDefinition<grpc.UntypedServiceImplementation>,
    { sendLog },
  );
  server.bindAsync(target, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
  console.info('grpc server is live');
}

process.on('uncaughtException', (err) => {
  console.error('process on uncaughtException error', err, 'index.ts');
});

process.on('unhandledRejection', (err) => {
  console.error(
    `process on unhandledRejection error: ${
      JSON.stringify(err) ?? '[NoMetaData]'
    }`,
  );
});

createNatsConnection({ servers: server })
  .then((con) => {
    natsConnection = con;
    console.info('connected to nats');
    main();
  })
  .catch((e) => {
    console.error(e);
  });

// SPDX-License-Identifier: Apache-2.0

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { createLogBuffer } from '@tazama-lf/frms-coe-lib/lib/helpers/protobuf.js';
import 'dotenv/config';
import type { NatsConnection } from 'nats';
import path from 'node:path';
import * as util from 'node:util';
import server, { port, subject } from './config/server.js';
import { createNatsConnection } from './services/nats.js';
import { LoggerService } from '@tazama-lf/frms-coe-lib';

const loggerConfig = {
  functionName: '',
  maxCPU: 1,
  nodeEnv: 'dev', // local logs only
};

const loggerService: LoggerService = new LoggerService(loggerConfig);

const PROTO_PATH = path.join(__dirname, '../node_modules/@tazama-lf/frms-coe-lib/lib/helpers/proto/Lumberjack.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const logProto = (grpc.loadPackageDefinition(packageDefinition).lumberjack as grpc.GrpcObject).Lumberjack as grpc.GrpcObject;

let natsConnection: NatsConnection;

const target = `0.0.0.0:${port}`;

function sendLog(call: grpc.ServerUnaryCall<Record<string, unknown>, unknown>, callback: grpc.sendUnaryData<unknown>): void {
  // call.request is the Log Object
  // send to NATS
  const messageBuffer = createLogBuffer(call.request);
  if (messageBuffer != null) {
    natsConnection.publish(subject, messageBuffer);
    loggerService.log(`${(call.request.channel as string | undefined) ?? 'unknown'} has published`);
  } else {
    loggerService.error('failed to encode log buffer', call);
  }

  callback(null, null);
}

function main(): void {
  loggerService.log('starting grpc server');
  const server = new grpc.Server();
  server.addService(logProto.service as unknown as grpc.ServiceDefinition, { sendLog });
  server.bindAsync(target, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
    if (error) {
      loggerService.error(error);
    }
  });
  loggerService.log(`grpc server is live on: ${target}`);
}

process.on('uncaughtException', (err) => {
  loggerService.error('process on uncaughtException error', util.inspect(err), 'index.ts');
});

process.on('unhandledRejection', (err) => {
  loggerService.error(`process on unhandledRejection error: ${util.inspect(err)}`);
});

createNatsConnection({ servers: server })
  .then((con) => {
    natsConnection = con;
    loggerService.log('connected to nats');
    main();
  })
  .catch((e: unknown) => {
    loggerService.error(util.inspect(e));
  });

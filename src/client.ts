// SPDX-License-Identifier: Apache-2.0

/* An example gRPC client */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { type LogMessage } from '@frmscoe/frms-coe-lib/lib/helpers/proto/lumberjack/LogMessage';
import { type LumberjackClient } from '@frmscoe/frms-coe-lib/lib/helpers/proto/lumberjack/Lumberjack';
import path from 'node:path';

const PROTO_PATH = path.join(__dirname, '../node_modules/@frmscoe/frms-coe-lib/lib/helpers/proto/Lumberjack.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- trust me
const logProto: any = grpc.loadPackageDefinition(packageDefinition).lumberjack;
const client: LumberjackClient = new logProto.Lumberjack('localhost:5000', grpc.credentials.createInsecure());

const object: LogMessage = {
  message: 'foo',
  level: 'error',
  channel: 'tms-service',
};

client.sendLog(object, () => {
  console.log('sent', object);
});

/* An example gRPC client */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { LogMessage } from '@frmscoe/frms-coe-lib/lib/helpers/proto/lumberjack/LogMessage';
import { LumberjackClient } from '@frmscoe/frms-coe-lib/lib/helpers/proto/lumberjack/Lumberjack';
import path from 'node:path';

const PROTO_PATH = path.join(__dirname, '../node_modules/@frmscoe/frms-coe-lib/lib/helpers/proto/Lumberjack.proto');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var log_proto: any = grpc.loadPackageDefinition(packageDefinition).lumberjack;
var client: LumberjackClient = new log_proto.Lumberjack('localhost:5000', grpc.credentials.createInsecure());

let object: LogMessage = {
  message: "foo",
  level: 'error',
  channel: "tms-service",
};

client.sendLog(object, () => {
  console.log("sent", object)
})

import 'dotenv/config';
import { createNatsConnection } from "./services/nats.js";
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import server, { subject, port } from './config/server.js';
import { NatsConnection } from 'nats';
import path from 'node:path';
import { createLogBuffer } from '@frmscoe/frms-coe-lib/lib/helpers/protobuf.js';

const PROTO_PATH = path.join(__dirname, '../node_modules/@frmscoe/frms-coe-lib/lib/helpers/proto/Lumberjack.proto');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var log_proto: any = grpc.loadPackageDefinition(packageDefinition).lumberjack;
let natsConnection: NatsConnection;

const target = `0.0.0.0:${port}`;

function sendLog(call: any, callback: any) {
  // call.request is the Log Object
  //send to NATS
  //
  const messageBuffer = createLogBuffer(call.request)
  if (messageBuffer) {
    natsConnection.publish(subject, messageBuffer);
    console.log('published')
  } else {
    console.error('failed to encode log buffer', call);
  }

  callback();
}

async function main() {
  console.info("starting grpc server");
  var server = new grpc.Server();
  server.addService(log_proto.Lumberjack.service, { sendLog });
  server.bindAsync(
    target,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
  console.info("grpc server is live");
}

process.on("uncaughtException", (err) => {
  console.error("process on uncaughtException error", err, "index.ts");
});

process.on("unhandledRejection", (err) => {
  console.error(
    `process on unhandledRejection error: ${JSON.stringify(err) ?? "[NoMetaData]"
    }`
  );
});


createNatsConnection({ servers: server }).then((con) => {
  natsConnection = con;
  console.info("connected to nats");
  main();
})

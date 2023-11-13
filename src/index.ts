import 'dotenv/config';
import { createNatsConnection } from "./services/nats.js";
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import server, { subject } from './config/server.js';
import { JSONCodec } from 'nats';

var PROTO_PATH = 'proto/message.proto';


var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var log_proto: any = grpc.loadPackageDefinition(packageDefinition).message;

const target = "localhost:50051";

const natsConnection = await createNatsConnection({ servers: server });
console.info("connected to nats");

const jc = JSONCodec();
function sendLog(call: any, callback: any) {
  // call.request is the Log Object
  //send to NATS

  natsConnection.publish(subject, jc.encode(call.request));
  console.log('published')
  callback();
}

async function main() {
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

await main();

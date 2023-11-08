import { NatsConnection } from "nats";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH =
  __dirname +
  "node_modules\\@frmscoe\\frms-coe-lib\\lib\\helpers\\proto\\Log.proto";

var NatsConn: NatsConnection;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var log_proto = grpc.loadPackageDefinition(packageDefinition).message;
const target = "localhost:50051";

function Log(message: any) {
  //send to NATS
}

function main() {
  var server = new grpc.Server();
  server.addService(log_proto.Greeter.service, { Log: Log });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

process.on("uncaughtException", (err) => {
  console.error("process on uncaughtException error", err, "index.ts");
});

process.on("unhandledRejection", (err) => {
  console.error(
    `process on unhandledRejection error: ${
      JSON.stringify(err) ?? "[NoMetaData]"
    }`
  );
});

main();

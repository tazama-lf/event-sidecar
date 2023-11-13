import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

var PROTO_PATH = 'proto/message.proto';

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var log_proto: any = grpc.loadPackageDefinition(packageDefinition).message;
var client = new log_proto.Lumberjack('localhost:50051', grpc.credentials.createInsecure());

let object = {
  message: "foo",
  level: 2,
  level_name: "bar",
  channel: "channel",
};

client.sendLog(object, () => {
  console.log("sent", object)
})

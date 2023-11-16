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


type Message = {
  message: string,
  level: 'error' | 'info' | 'warn' | 'trace' | 'fatal',
  channel: string
}

let object: Message = {
  message: "foo",
  level: 'error',
  channel: "tms-service",
};

client.sendLog(object, () => {
  console.log("sent", object)
})

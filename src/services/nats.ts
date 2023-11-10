import { ConnectionOptions, connect } from "nats";


export const createNatsConnection = async (opts?: ConnectionOptions) => {
  return await connect(opts)
}


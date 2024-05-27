// SPDX-License-Identifier: Apache-2.0

import { type ConnectionOptions, connect, type NatsConnection } from 'nats';

export const createNatsConnection = async (
  opts?: ConnectionOptions,
): Promise<NatsConnection> => {
  return await connect(opts);
};

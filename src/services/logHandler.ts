// SPDX-License-Identifier: Apache-2.0

import type * as grpc from '@grpc/grpc-js';
import type { LoggerService } from '@tazama-lf/frms-coe-lib';
import { createLogBuffer } from '@tazama-lf/frms-coe-lib/lib/helpers/protobuf.js';
import type { NatsConnection } from 'nats';

/**
 * Encodes an incoming gRPC log request and publishes it to NATS.
 *
 * Extracted from the gRPC server wiring so the publish/no-publish branches can be unit tested
 * without standing up a gRPC server or a live NATS connection.
 */
export function handleSendLog(
  call: grpc.ServerUnaryCall<Record<string, unknown>, unknown>,
  natsConnection: Pick<NatsConnection, 'publish'>,
  loggerService: Pick<LoggerService, 'log' | 'error'>,
  subject: string,
): void {
  const messageBuffer = createLogBuffer(call.request);
  if (messageBuffer != null) {
    natsConnection.publish(subject, messageBuffer);
    loggerService.log(`${(call.request.channel as string | undefined) ?? 'unknown'} has published`);
  } else {
    loggerService.error('failed to encode log buffer', call.request);
  }
}

// SPDX-License-Identifier: Apache-2.0

import { createLogBuffer } from '@tazama-lf/frms-coe-lib/lib/helpers/protobuf.js';
import { handleSendLog } from '../src/services/logHandler';

jest.mock('@tazama-lf/frms-coe-lib/lib/helpers/protobuf.js', () => ({
  createLogBuffer: jest.fn(),
}));

const mockedCreateLogBuffer = createLogBuffer as unknown as jest.Mock;

describe('handleSendLog', () => {
  const subject = 'test.subject';
  let natsConnection: { publish: jest.Mock };
  let loggerService: { log: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    natsConnection = { publish: jest.fn() };
    loggerService = { log: jest.fn(), error: jest.fn() };
  });

  it('publishes the encoded buffer to NATS and logs the channel when encoding succeeds', () => {
    const buffer = new Uint8Array([1, 2, 3]);
    mockedCreateLogBuffer.mockReturnValue(buffer);
    const call = { request: { channel: 'pain001' } } as never;

    handleSendLog(call, natsConnection, loggerService, subject);

    expect(mockedCreateLogBuffer).toHaveBeenCalledWith({ channel: 'pain001' });
    expect(natsConnection.publish).toHaveBeenCalledWith(subject, buffer);
    expect(loggerService.log).toHaveBeenCalledWith('pain001 has published');
    expect(loggerService.error).not.toHaveBeenCalled();
  });

  it('falls back to "unknown" when the request has no channel', () => {
    mockedCreateLogBuffer.mockReturnValue(new Uint8Array());
    const call = { request: {} } as never;

    handleSendLog(call, natsConnection, loggerService, subject);

    expect(natsConnection.publish).toHaveBeenCalledTimes(1);
    expect(loggerService.log).toHaveBeenCalledWith('unknown has published');
  });

  it('logs an error and does not publish when encoding fails', () => {
    mockedCreateLogBuffer.mockReturnValue(null);
    const call = { request: { channel: 'pain001' } } as never;

    handleSendLog(call, natsConnection, loggerService, subject);

    expect(natsConnection.publish).not.toHaveBeenCalled();
    expect(loggerService.log).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalledWith('failed to encode log buffer', (call as { request: unknown }).request);
  });
});

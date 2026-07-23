// SPDX-License-Identifier: Apache-2.0

import { connect } from 'nats';
import { createNatsConnection } from '../src/services/nats';

jest.mock('nats', () => ({
  connect: jest.fn(),
}));

const mockedConnect = connect as unknown as jest.Mock;

describe('createNatsConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connects with the provided options and returns the connection', async () => {
    const fakeConnection = { publish: jest.fn() };
    mockedConnect.mockResolvedValue(fakeConnection);
    const opts = { servers: 'nats://localhost:4222' };

    const connection = await createNatsConnection(opts);

    expect(mockedConnect).toHaveBeenCalledWith(opts);
    expect(connection).toBe(fakeConnection);
  });

  it('connects with no options when none are supplied', async () => {
    const fakeConnection = { publish: jest.fn() };
    mockedConnect.mockResolvedValue(fakeConnection);

    await createNatsConnection();

    expect(mockedConnect).toHaveBeenCalledWith(undefined);
  });
});

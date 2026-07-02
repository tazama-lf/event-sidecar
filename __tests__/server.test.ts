// SPDX-License-Identifier: Apache-2.0

jest.mock('@tazama-lf/frms-coe-lib/lib/config', () => ({
  validateEnvVar: jest.fn((name: string) => {
    switch (name) {
      case 'NATS_SUBJECT':
        return 'test.subject';
      case 'NATS_SERVER':
        return 'nats://localhost:4222';
      case 'PORT':
        return 50051;
      default:
        return undefined;
    }
  }),
}));

import serverDefault, { port, server, subject } from '../src/config/server';

describe('config/server', () => {
  it('reads NATS_SUBJECT, NATS_SERVER and PORT from the environment', () => {
    expect(subject).toBe('test.subject');
    expect(server).toBe('nats://localhost:4222');
    expect(port).toBe(50051);
  });

  it('exports the NATS server as the default export', () => {
    expect(serverDefault).toBe('nats://localhost:4222');
  });
});

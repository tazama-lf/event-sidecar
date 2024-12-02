// SPDX-License-Identifier: Apache-2.0

import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/config';

export const subject = validateEnvVar<string>('NATS_SUBJECT', 'string');
export const server = validateEnvVar<string>('NATS_SERVER', 'string');
export const port = validateEnvVar<number>('PORT', 'number');
export default server;

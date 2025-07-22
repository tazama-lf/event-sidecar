// SPDX-License-Identifier: Apache-2.0

import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/config';

export const subject = validateEnvVar('NATS_SUBJECT', 'string') as string;
export const server = validateEnvVar('NATS_SERVER', 'string') as string;
export const port = validateEnvVar('PORT', 'number') as number;
export default server;

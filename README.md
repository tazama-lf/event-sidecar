<!-- SPDX-License-Identifier: Apache-2.0 -->

# event-sidecar

This is a gRPC server that is also a NATS publisher. It retrieves logs from the main processor through gRPC and publishes them to Lumberjack through NATS.

For FAQ and troubleshooting, consult: [Troubleshooting](https://github.com/tazama-lf/docs/blob/f3f5cf07425e9785c27531511601fc61a81e51e4/Technical/Logging/Troubleshooting.md)

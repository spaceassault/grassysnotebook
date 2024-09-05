import { createRequestHandler } from "@vercel/remix";
import { generateNonce } from "../utils/nonce-provider.server";
import * as build from "@remix-run/dev/server-build";

export const config = {
  runtime: 'edge',
};

export default function (request: Request) {
  const nonce = generateNonce();
  console.log("Generated nonce:", nonce); // Add this line for debugging
  return createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
    getLoadContext: () => ({ nonce }),
  })(request);
}
  
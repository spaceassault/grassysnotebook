declare module '@remix-run/node' {
    interface AppLoadContext {
        nonce: string;
    }
}
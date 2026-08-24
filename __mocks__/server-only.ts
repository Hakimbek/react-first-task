// Jest mock for 'server-only'.
// The real package throws at import time when loaded in a browser/client bundle.
// In Jest (Node environment) we just export nothing — the server-only guard is unnecessary.
export {}

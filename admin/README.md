# MolarCoaster Admin

## Run

```powershell
npm install
npm run dev
```

Open http://localhost:8081. The dev server uses a fixed port and exits if 8081 is already occupied.

## Verify

```powershell
npm test
npm run test:e2e
npm run test:html
npm run build
```

Playwright uses the installed Chrome channel. The HTML validator audits the separate static customer site.

## Security

This is a local demo with mock patient data. Login currently accepts any non-empty username and password and stores an auth flag in browser storage; it is not production authentication and must not protect real patient records. A server-validated identity provider is required before real use.

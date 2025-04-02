# NanoKVM-USB Browser

This is the NanoKVM-USB browser version project.

Online website: [usbkvm.sipeed.com](https://usbkvm.sipeed.com).

## Development

```shell
cd web
pnpm install
pnpm dev
```

## Deployment

1. Execute `pnpm build` to build the project.
2. Execute `npm install -g http-server` to install http-server.
3. Execute `http-server -p 8080 -a localhost` to run the service.
4. Open the Chrome browser and visit `http://localhost:8080`.

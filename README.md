# CORS http proxy

This is a simple reverse proxy which can be used for development to access server responses where CORS is not enabled for a specific reason.

In addition to allowing all CORS preflight requests, it will also expose access control headers (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) based on some random
tokens like "token", "secret", "csrf"

# Usage

## Install the package as a dev dependency in your application

```bash
npm install cors-http-proxy --save-dev
```

### Start the proxy by setting a desired target and port

```
cors-http-proxy -t https://google.ro -p 8082
```

### Example with an angular application with npm scripts

```
{
  "scripts": {
    "start:dev": "cors-http-proxy -t https://your-dev-server.com -p 8082 | ng serve"
  }
}
```

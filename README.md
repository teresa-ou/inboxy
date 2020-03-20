<p align="center">
  <img width="650" src="https://github.com/teresa-ou/inboxy/blob/master/images/inboxy-illustration.png" alt="Illustration of inboxy">
</p>

# inboxy: Google Inbox-style bundles for Gmail

inboxy is a Chrome extension that bundles together your email messages and makes it easier to manage
your inbox.

## Features

* Messages with the same label are bundled together in your inbox
* Archive all bundled messages on the current page quickly
* Star a message to pin it outside of its bundle
* Intuitive date headings
* Supports light and dark themes

For more info, visit https://teresa-ou.github.io/inboxy.

## Setup

inboxy uses webpack to bundle js files:

```bash
# Install dependencies
npm install

# Build with webpack to create dist/content.js
npm run build
```

The `dist` directory can then be loaded as an [unpacked extension](https://developer.chrome.com/extensions/getstarted).

## Feedback

Feel free to [send feedback](https://github.com/teresa-ou/inboxy/issues) by filing an issue.

## License

[GPL](https://github.com/teresa-ou/inboxy/blob/master/COPYING), Copyright (C) 2020  [Teresa Ou](https://github.com/teresa-ou)

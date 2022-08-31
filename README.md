## ⚠️ Maintenance & support

inboxy continues to be available for Chrome and Firefox, but the extension is no longer actively maintained.

Critical updates that affect the core functionality of the extension (i.e. bundling) will still be made, as needed. Issues and pull requests will not be actively monitored.

---

<p align="center">
  <img width="650" src="https://github.com/teresa-ou/inboxy/blob/master/images/inboxy-illustration.png" alt="Illustration of inboxy">
</p>

# inboxy: Google Inbox-style bundles for Gmail

inboxy is a browser extension that bundles together your email messages and makes it easier to manage
your inbox. 

Available for [Chrome](https://chrome.google.com/webstore/detail/inboxy-inbox-bundles-for/clahkkinbdcdnogkkgmacmiknnamahha) 
and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/inboxy-inbox-bundles-for-gmail/).

## Features

* Messages with the same label are bundled together in your inbox
* Archive all bundled messages on the current page quickly
* Star a message to pin it outside of its bundle
* Intuitive date headings
* Supports light and dark themes

For more info, visit https://www.inboxymail.com.

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

## Acknowledgements

* [material.io](https://material.io/resources/icons/): Icons in [dist/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/assets/), [dist/options/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/options/assets/), and [dist/popup/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/popup/assets/) are modified versions of icons from material.io. The original material.io icons are licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
* [Nova](https://www.streamlineicons.com/nova/index.html): The inboxy logo is modified from a Nova icon.

## License

[GPL](https://github.com/teresa-ou/inboxy/blob/master/COPYING), Copyright (C) 2020  [Teresa Ou](https://github.com/teresa-ou)

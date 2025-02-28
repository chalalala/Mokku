# Important Update

### ✨ New features on this fork ✨

-  Import/export mocks
-  Toggle all mocks

**❓ Migrate data to this version of extension?**

New install of this version might not include the old data from the original Mokku extension.

To migrate the data, you need to open inspect on the original Mokku extension and run the following code in the console to export the data to a file:

```js
const data = await chrome.storage.local.get("mokku.extension.main.db");
const mocks = data["mokku.extension.main.db"].mocks;
const blob = new Blob([JSON.stringify(mocks)], {
	type: "application/json",
});
const link = document.createElement("a");
const url = URL.createObjectURL(blob);

link.href = url;
link.download = "mokku.json";
link.click();

URL.revokeObjectURL(url);
```

Then you can use the import feature of this version to import the data.

.❀。• *₊°。 ❀°。.❀。• *₊°。 ❀°。.❀。• *₊°。 ❀°。.❀。• *₊°。 ❀°。.❀。• *₊°。 ❀°。.❀。• *₊°。 ❀°。

### Mokku is changing

Mokku is in transiton form Panel based extention to full page dashboard. For more better ease of use and more features.

### GraphQL

GraphQL support is next in the list.

### Premium Version

Ads free and exclusive features.

# Mokku

> Mock API calls seamlessly

![small-promo](./docs/store/small-promo.png)

[Chrome Web Store](https://chrome.google.com/webstore/detail/mokku-mock-api-calls-seam/llflfcikklhgamfmnjkgpdadpmdplmji?hl=en&authuser=1) | [MS Edge Add on](https://microsoftedge.microsoft.com/addons/detail/mokku-mock-api-calls-sea/ekcbmjnnnphonejedibidifflhljbobc)

## Support

Developing and maintaing the extenstion requires quite an effort! Cosnider supporting the extention!

<a href="https://paypal.me/mukuljainx" title="Support Mokku using Paypal" target="_blank"><img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png" border="0" alt="PayPal Logo"></a>

<a href="https://www.buymeacoffee.com/mukuljainx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

**UPI Number:** 811721108 (this is not a mobile number but a UPI number)

### About

Mokku helps user by mocking API and changing their response, response time and status, user can try all test case scenario like long loading time, error states, or any missing or incorrect data.

Mokku adds itself as a tab in dev tools as a panel. In the tab user can see network logs and mocks. Any network call from the logs can be mocked by simply clicking mock button then response can be edited. User can also search logs. Mock can also be created from scratch from create mock button.

All URL's are accessible but Mokku doesn't inject scripts into any pages apart from which are served locally and accessed using 'http://localhost\*' until enabled from the Panel.

Collections & Dynamic mock generators coming soon!

You can submit issues, bugs or feature request at https://github.com/mukuljainx/mokku/issues

This extension is development phase, might not work in some kind of response like md files.

[Promotional Images](https://github.com/mukuljainx/Mokku/tree/master/docs/store)

### Features

1. Mock API call, specify JSON body, status, time delay and even headers 🙌.
2. **Wild Card:** add `(.*)` as wild card in url which will match anything, for example: `some-domain/user/(.*)/messages`. This will match `some-domain/user/u1/messages` and `some-domain/user/u2/messages` too.

### GraphQL

Mokku doesn't support GraphQL as of now.

### Privacy policy

Mokku does not collect or ask for any personal information, though it will store the mocks the chrome local store & all the hosts name where it has been enabled once to provide better experience to user.

## Dev Guide

### Prerequisites

-  [node + npm](https://nodejs.org/) (Current Version)

### Project Structure

-  dist: Chrome Extension directory
-  dist/js: Generated JavaScript files

### Setup

`npm install`

### Dev

`npm run watch`

### Build

`npm run build`

### Load extension to chrome

Load `dist` directory. All the files are refreshed without extension reload except content script. Reload the extension to see the changes.

### Built on

[Chitbat Chrome extension starter kit](https://github.com/chibat/chrome-extension-typescript-starter)

<a style="margin-left: 16px" href="https://www.buymeacoffee.com/mukuljainx" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 52px !important;" ></a>

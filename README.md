# GiFo

Automatic GIF sender for the GIPHY Twitch extension (experimental).

### Installation

```sh
$ npm ci
```

### Configuration

Edit `.env` file with channel name, delay between requests, and path to Chrome's executable as GiFo uses [Puppeteer](https://www.npmjs.com/package/puppeteer) to interact with the extension.

### Usage

```sh
$ npm run start
```

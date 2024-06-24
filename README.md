<h3 align="center">Taaabs</h3>

<p align="center">
    Codebase powering our front-ends.
    <br />
    <i>apps and browser extension</i>
    <br />
    <a href="https://taaabs.com"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#roadmap"><strong>Roadmap</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#self-hosting"><strong>Self-hosting</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
</p>

## Introduction

Taaabs is a free, fully-featured bookmarking app.

A bookmark consists of everything you'd expect:

- title
- note
- tags
- stars
- cover image
- content for permanent reader

With **an optional account** you can sync bookmarks (secured with end-to-end encryption) across devices and build a public library to let others subscribe to its updates.

Taaabs built-in support for alternative syncing services ensures no user ever feels locked-in.

## Features

#### Permanent Reader

Anytime you invoke bookmarklet script or save via web extension, HTML of a website (along with cover image and favicon) is copied to the clipboard, and you're redirected to a bookmark creation form for on-device parsing (this process requires clipboard read permissions). Parser then analyzes source and content of a website and determines the best way to parse it - for the best reading experience some sources have dedicated parsers. For example conversations from ChatGPT, Gemini, HuggingFace Chat, etc. are saved in a way to be later displayed following the same conversational structure.

#### Full-text search

Taaabs indexes content of saved links. It runs locally thus results are just at your fingerprints.

## Privacy

Taaabs processes and stores all saved bookmarks on-device. The only time the app communicates with the server is when you are syncing with an optional account, then all private bookmarks are secured with end-to-end encryption. Public bookmarks can remain partially private, Taaabs enables granular control over each link and tag visibility.

We use state-of-the-art encryption standards and for transparency, all the code of our clients is available publicly in this repository.

## Pricing

Free for personal use. We don't charge based on features or usage. Only pay if you use Taaabs commercially.

## Sync

Sync is a subscription based offering allowing you to store your bookmarks in the cloud.

It's just $4 USD per month, billed annually.

## Roadmap

- Saving X threads.
- Small but capable AI model run locally to assist with saved content (e.g. phi-3-mini).

## Contributing

Contributions are welcome. If you have any feature requests, bug reports, or questions, feel free to create an issue or engage with other Taaabs users in [discussions](discussions).

## Self-hosting

As Taaabs runs entirley in the browser you can host it with any static hosting or web server. [gh pages link deployed from this repo]

## Acknowledgements

Special thanks to all the authors and contributors of [Orama](https://github.com/askorama/orama), search engine enabling fast and accurate local searches.

<h3 align="center">Taaabs</h3>

<p align="center">
    Codebase powering our front-ends.
    <br />
    <i>web, browser extensions and mobile</i>
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

Taaabs is a free<small>\*</small>, privacy focused and modern bookmarking app.

It fetches, parses and stores websites on-device, so no API requests are involved.

A bookmark includes everything you'd expect:

- title
- note
- tags
- stars
- favicon
- cover image
- content for Permanent Reader
- highlights

<small>\* Free for personal use with on-device library.</small>

## Features

### Permanent Reader

Anytime you invoke bookmarklet script or save via web extension, HTML of a website (along with cover image and favicon) is copied to the clipboard, and you're redirected to a bookmark creation form for on-device parsing (this process requires clipboard read permissions). Parser then analyzes source and content of a website and determines the best way to parse it - for the best reading experience some sources have dedicated parsers. For example conversations from ChatGPT, Gemini, HuggingFace Chat, etc. are saved in a way to be later displayed following the same conversational structure.

### Full-text search

Taaabs efficiently indexes and caches all text content of saved links. It runs locally thus results are just at your fingerprints.

## Roadmap

View the [Roadmap](https://taaabs.com) for details on our planned features and future direction.

## Contributing

There are lots of ways to contribute to Taaabs.

- [Submit bug](https://github.com/taaabs/taaabs/issues) reports and help us [verify fixes](https://github.com/taaabs/taaabs/pulls) as they are pushed up.
- Review and collaborate [source code](https://github.com/taaabs/taaabs/pulls) changes.
- Engage with other Taaabs users and developers in the [discussions](discussions) tab.
- Contribute bug fixes.
- Help translate language packs.
- Submit feature proposals and documentation improvements.

Signing CLA needs to be done only once for all PRs and contributions.

## Self-hosting

As Taaabs runs entirley in the browser you can host it with any static hosting or web server. [gh pages link deployed from this repo]

## Acknowledgements

Special thanks to all the authors and contributors of [Orama](https://github.com/askorama/orama), search engine enabling fast and accurate local searches.

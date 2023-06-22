# Taaabs - next-gen social bookmarking

This document contains qucik start, configuration and technical details on working with Taaabs codebase. For business details, decision log, functional and non-functional requirements visit the project's wiki.

Please note that this document may be incomplete.

## Table of contents

- [Quick guide](#quick-guide)
- [API documentation](#api-documentation)
- [System architecture overview](#system-architecture-overview)
- [Application business logic](#application-business-logic)
- [Dependencies](#dependencies)
- [Client web](#client-web)

## Quick guide

TODO

## API documentation

API documentation is generated from code and accessible from two web interfaces:

- [SWAGGER](http://localhost:4000/swagger)
- [REDOC](http://localhost:4000/redoc)

## System architecture overview

TODO: create diagrams with mermaid, explain static/dynamic deployments, backend server topology

## Application business logic

TODO: explain what are main data structures and how different things are wired together

## Dependencies

TODO: explain used third-party services, for example used for e-mail handling (send grid)

## Client web

Routing

#### User routes:

- www.taaabs.com/home [logged in user]
- www.taaabs.com/my-library [logged in user]

#### Public routes:

- www.taaabs.com
- www.taaabs.com/pricing
- www.taaabs.com/[username]
- www.taaabs.com/[username]/library?tags=a,b,c
- www.taaabs.com/[username]/about
- [username].taaabs.com
- [username].taaabs.com/library?tags=a,b,c
- [username].taaabs.com/about

Wildcard urls above are served from dynamic host so that these routes are SEO enabled.

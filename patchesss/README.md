This path sets default Cache-Control header for html documents returned by the server.
The reason behind this override is that manual header setup is not applied.

Read more: https://github.com/vercel/next.js/pull/39707

When mentioned PR is merged:

- patch should be deleted
- headers should be adjusted accordingly in next.config.js

This path sets default Cache-Control header for html documents returned by the server.
The reason behind this override is that manual header setup is not applied.

Read more: https://github.com/vercel/next.js/pull/39707

Should be removed when the PR above gets merged.
1. Root domain can't have trailing slash

2. For non root domain links check if version without trailing slash redirect to one with a triling slash. Example: https://fastify.dev/organisations/ (Github pages)

3. Some websites work without trailing slashes and with them e.g.

- https://www.udemy.com/home/my-courses/learning
- https://www.udemy.com/home/my-courses/learning/
- https://www.amazon.com/gp/bestsellers/books/720358
- https://www.amazon.com/gp/bestsellers/books/720358/

Stored urls must not have them. Websites redirecting to trailing slash should be marked with a boolean value and logic should be added to avoid redirects upon website visit.

4. To ensure equal URL hases, all query parameters should be ordered alphabetically, repeated params' values must be ordered as well.

5. Some query parameters should be stripped off the link, e.g. "ref".

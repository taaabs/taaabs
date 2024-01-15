Each bookmark can have a flat list of associated tags.
Tag is a globally unique string living in a table "tags".

### Tags on a bookmark

To find all tags associated with a bookmark and their order lookup table "tags_on_bookmarks".

### Bookmarks with a given tag or tags

To find all bookmarks associated with given tag/s - concatenate them with a space and lookup table "tag_combinations_on_bookmarks".

### Update tag list on a bookmark

Updating tags on a bookmark is a two step process:

Step one: update "tags on bookmarks" for each tag added/updated/deleted.

Step two: **Recreate** (remove all present rows prior work) tag combinations for each combination of tags, eg. if a bookmark has following tags:

- recipes
- cooking
- pasta
- carbonara

we will add rows for each combination **alphabetically** as follows:

| user_id | bookmark_id | tag_combination                   |
| ------- | ----------- | ------------------------------- |
| 1       | 1           | carbonara                       |
| 1       | 1           | cooking                         |
| 1       | 1           | pasta                           |
| 1       | 1           | recipes                         |
| 1       | 1           | carbonara cooking               |
| 1       | 1           | carbonara pasta                 |
| 1       | 1           | carbonara recipes               |
| 1       | 1           | carbonara cooking pasta         |
| 1       | 1           | carbonara cooking recipes       |
| 1       | 1           | carbonara cooking pasta recipes |
| 1       | 1           | cooking pasta                   |
| 1       | 1           | cooking recipes                 |
| 1       | 1           | cooking pasta recpies           |
| 1       | 1           | pasta recipes                   |

> Algorithm inspiration: https://stackoverflow.com/a/64844881

### List of related tags

Say we list all bookmarks with tags _recipes_ and _cooking_.
<br>
Results contain above tags as well as other tags.

The objective is to list in the aside all tags occuring on visible bookmarks with total number of bookmarks they will yield upon selection.

| user_id | bookmark_id | tag_combination             |
| ------- | ----------- | ------------------------- |
| 93      | 1           | cooking recpies           |
| 93      | 2           | cooking recpies           |
| 93      | 2           | carbonara cooking recpies |
| 93      | 3           | cooking recpies           |
| 93      | 3           | cooking recpies other     |

1. Select all bookmarks which tag_combination is equal to what is selected. If there are provided excluded tags, filter out all bookmarksIds containing them.
2. For each bookmark select all tags from "tags_on_bookmarks" ommiting current tags and count them.

| tag_id | count |
| ------ | ----- |
| 1      | 1     |
| 5      | 12    |
| 7      | 11    |

Counting occurences of each tag gives number of bookmarks that are going to be shown upon its selection.


# What characters are allowed in tag names?

https://meta.stackexchange.com/a/298981

a-z 0-9 + # - .

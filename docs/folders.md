# Folders

Folders group together bookmarks containing at least one of user specified tags.

Folder **Culinary arts** has all bookmarks with a tag _cooking_ or _baking_.

Say this folder has a child called **Lunch** which lists all bookmarks having _pizza_ or _pasta_, therefore parent **Culinary arts** won't show bookmarks having

- _cooking_ _pizza_
- _cooking_ _pasta_
- _baking_ _pizza_
- _baking_ _pasta_

unless it is flattened. Flattened folder simply shows all bookmarks with any of its tags.

Child folder shows bookmarks having any of its tags as well as any of the parent tags.

folders

| folder_id | parent_id | label         |
| --------- | --------- | ------------- |
| 1         | _NULL_    | Culinary arts |
| 2         | 1         | Lunch         |

tags_on_folders

| user_id | folder_id | include_tag | exclude_tag |
| ------- | --------- | ----------- | ----------- |
| 1       | 1         | cooking     | blog        |
| 1       | 1         | baking      |             |
| 1       | 2         | pizza       |             |
| 1       | 2         | pasta       |             |

1. Get all bookmarks from folder ID 1.

From table "tag_hierarchies_on_bookmarks" select all distinct bookmark ids having cooking or baking, exclude all having blog, cooking pizza, cooking pasta, baking pizza, baking pasta.

2. Get all bookmarks from folder ID 2

From table "tag_hierarchies_on_bookmarks" select all distinct bookmark ids having cooking pizza, cooking pasta, baking pizza, baking pasta.

### Url

Folders are accessible via their hierarchy slugs, e.g.
taaabs.com/[username]/catalog/culinary-arts/baking

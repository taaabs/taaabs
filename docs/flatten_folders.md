### Flattening folders

Consider folder with a path `/cooking/recipes`

and its subfolders

`/cooking/recpies/pasta`
<br>
`/cooking/recipes/pizza`

The goal is to see all bookmarks present in /cooking/recipes and its subfolders.

First we get all folder ids with path starting with our current path.

Second, we get all unique bookmark ids present in these folders from bookmarks_on_folders.

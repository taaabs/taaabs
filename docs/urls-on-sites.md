Inspiration: https://news.ycombinator.com/from?site=forbes.com/sites/startswithabang

Let's say we save urls:

> https://github.com/openwrt/luci/pull/3291
>
> https://github.com/openwrt/openwrt/releases/tag/v22.03.4

> https://www.forbes.com/sites/startswithabang/2021/07/07/how-close-are-we-to-the-holy-grail-of-room-temperature-superconductors/?sh=1b503cb88665
>
> https://www.forbes.com/sites/startswithabang/2018/01/23/the-three-meanings-of-emc2-einsteins-most-famous-equation/?sh=3d409f3a71c0

Some websites serve user-owned content from path, instead of a subdomain. So finding similar websites based on sole domain is not feasible. In the examples above, user may want to see all bookmarks from

- github.com/openwrt
- www.forbes.com/sites/startswithabang

In our solution we leave a user choice whether to assign a bookmark to such partial URL. If for a given url there already is a "site" we suggest it, but leave its selection to the user.

### Finding all urls for given site globally

Lookup table "urls_on_sites", find all url ids for given site Id

### Finding all urls for given site by userId

Lookup table "bookmarks_metadata", find all associated bookmarks.

import { Dictionary } from './dictionary'

const dictionary: Dictionary = {
  auth: {
    log_in: {
      heading: {
        text: 'Log in',
        subtext: 'to continue to Taaabs',
      },
    },
    sign_up: {
      heading: {
        text: 'Sign up',
        subtext: 'We hate paperwork, too.',
      },
    },
  },
  library: {
    follow: 'Follow',
    unfollow: 'Unfollow',
    welcome: 'Howdy',
    send_feedback: 'Send feedback',
    search_placeholder: 'Search in titles, notes, tags and links...',
    bookmark_updated: 'Bookmark has been updated',
    all_bookmarks: 'All bookmarks',
    drag_tag_here:
      'In Taaabs, folders are built by stacking tags on one another. Begin by dragging a tag over.',
    tag_hierarchies_upated: 'Folders has been updated',
    collapse_sidebar: 'Collapse sidebar',
    pin: 'Pin',
    unpin: 'Unpin',
    link_is_now_pinned: 'Link is now pinned',
    pin_has_been_removed: 'Pin has been removed',
    nothing_pinned: 'Nothing is pinned here',
    pinned_links_has_beed_updated: 'Pinned links has been updated',
    via_archive_org: 'Use snapshot',
    use_snapshot: 'Link is now using snapshot',
    use_original: 'Link is back to its original URL',
    sort_by: 'Sort by',
    sort_by_options: {
      date: 'Date',
      the_huggiest: 'The huggiest!',
      created: 'Created',
      visited: 'Visited',
      updated: 'Updated',
    },
    order: 'Order',
    order_options: {
      newest: 'Newest',
      oldest: 'Oldest',
    },
  },
}

export default dictionary

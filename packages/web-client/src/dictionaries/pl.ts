import { Dictionary } from './dictionary'

export const dictionary: Dictionary = {
  auth: {
    log_in: {
      heading: {
        text: 'Zaloguj się',
        subtext: 'aby kontynuuować do Taaabs',
      },
    },
    sign_up: {
      heading: {
        text: 'Utwórz konto',
        subtext: 'Też nie lubimy papierkowej roboty...',
      },
    },
  },
  library: {
    follow: 'Obserwuj',
    unfollow: 'Przestań obserwować',
    welcome: 'Witaj',
    send_feedback: 'Prześlij opinię',
    search_placeholder: 'Szukaj w tytułach, notkach, tagach i linkach...',
    bookmark_updated: 'Zakładka została zaktualizowana',
    all_bookmarks: 'All bookmarks',
    drag_tag_here: 'Upuść tag tutaj i zbuduj ich wizualną hierarchię!',
    tag_hierarchies_upated: 'Foldery zostały zaktualizowane',
    collapse_sidebar: 'Zwiń panel',
    pin: 'Przypnij',
    unpin: 'Odepnij',
    link_is_now_pinned: 'Link został dodany do przypiętych',
    pin_has_been_removed: 'Link został usunięty z przypiętych',
    nothing_pinned: 'Przypięte',
    pinned_links_has_beed_updated: 'Przypięte linki zostały zaktualizowana',
    via_archive_org: 'Przez Archive.org',
    use_snapshot: 'Odnośnik używa teraz kopii',
    use_original: 'Oryginalny link został przywrócony',
    sort_by: 'Sortowanie',
    sort_by_options: {
      created: 'Utworzenia',
      updated: 'Aktualizacji',
      visited: 'Wizyty',
      date: 'Data',
      the_huggiest: 'Punktowane',
    },
    order: 'Kolejność',
    order_options: {
      newest: 'Od najnowszych',
      oldest: 'Od najstarszych',
    },
  },
}

export default dictionary

import { Dictionary } from './dictionary'

export const dictionary: Dictionary = {
  library: {
    welcome: 'Witaj',
    send_feedback: 'Prześlij opinię',
    search_placeholder: 'Szukaj w tytułach, notkach, tagach i linkach...',
    bookmark_updated: 'Zakładka została zaktualizowana',
    all_bookmarks: 'All bookmarks',
    drag_tag_here: 'Upuść tag tutaj i zbuduj ich wizualną hierarchię!',
    tag_hierarchies_upated: 'Hierarchie tagów zostały zaktualizowane',
    collapse_sidebar: 'Zwiń panel',
    add_to_pinned: 'Dodaj do przypiętych',
    remove_from_pinned: 'Usuń z przypiętych',
    link_is_now_pinned: 'Link został dodany do przypiętych',
    pin_has_been_removed: 'Link został usunięty z przypiętych',
    pinned: 'Przypięte',
    pinned_items_has_beed_updated: 'Przypięte linki zostały zaktualizowana',
    sort_by: 'Sortowanie',
    sort_by_options: {
      created_at: 'Data utworzenia',
      updated_at: 'Data zaktualizowania',
      visited_at: 'Data ostatniej wizyty',
      popularity: 'Najbardziej uznane',
    },
    order: 'Kolejność',
    order_options: {
      newest_first: 'Od najnowszych',
      oldest_first: 'Od najstarszych',
    },
  },
}

export default dictionary

import { system_values } from '@shared/constants/system-values'
import { Dictionary } from './dictionary'

export const dictionary: Dictionary = {
  locale: 'pl',
  landing: {
    menu_items: {
      help_center: 'Centrum pomocy',
      pricing: 'Cennik',
      updates: 'Co nowego?',
    },
    log_in: 'Zaloguj się',
    open_app: 'Do aplikacji',
    about: {
      hero: {
        heading: {
          first_line: 'Najżyczliwsze',
          second_line: 'zakładki społecznościowe',
        },
        subheading:
          'Łatwa i bezpieczna strona do uporządkowania, udostępniania i odkrywania zakładek',
        claim_username: 'Przejmij nick',
        username: 'nick',
        ticks: [
          <>
            <strong>Szyfrowanie end-to-end</strong> prywatnych zakładek
          </>,
          <>
            <strong>Używaj za darmo</strong> tak długo, jak chcesz
          </>,
        ],
        incentive: '30 sekund lub mniej',
      },
    },
    pricing: {
      hero: {
        text: 'Cennik',
        subtext: (
          <>
            Rozpocznij za darmo, przejdź na wyższy plan w dowolnym momencie.
            <br />
            Podanie danych karty nie jest wymagane.
          </>
        ),
      },
      monthly: 'Miesięcznie',
      yearly: 'Rocznie',
      billed_monthly: 'przy rozliczaniu miesięcznym',
      billed_yearly: 'przy rozliczaniu rocznym',
      per_month: 'za miesiąc',
      tiers: [
        {
          name: 'Darmowy',
          description:
            'Wszystko czego potrzebujesz by zacząć przygodę z Taaabs',
          bullets_heading: 'Najważniejsze cechy:',
          bullets: [
            'Nielimitowane zakładki',
            'Nielimitowane tagi',
            'Szyfrowanie end-to-end',
          ],
          button_label: 'Rozpocznij za darmo',
        },
        {
          name: 'Surfer',
          description: 'Plan w przystępnej cenie dodający przydatne funkcje',
          bullets_heading: 'Wszystko co w darmowym, plus:',
          bullets: [
            'Filtruj oznaczone gwiazdkami oraz jako nieprzeczytane',
            'Sortuj według dat odwiedzin oraz edycji',
            'Wiele linków na zakładce',
          ],
          button_label: 'Przejdź na Surfer',
        },
        {
          name: 'Pro',
          description: 'Wykorzystaj pełnię możliwości jakie daje Taaabs',
          bullets_heading: 'Wszystko co w Surfer, plus:',
          featured_text: 'Polecane',
          bullets: [
            'Odblokuj wszystkie funkcje ✨',
            'Uzyskaj odznakę PRO',
            'Przejmij krótszy nick',
          ],
          button_label: 'Przejdź na Pro',
        },
      ],
    },
  },
  auth: {
    field_is_required: 'To pole jest wymagane.',
    invalid_email: 'Powyższy email jest nieprawidłowy.',
    something_went_wrong: 'Coś poszło nie tak... Spróbuj ponownie później.',
    recaptcha_privacy_notice: (
      <span>
        Ta strona jest chroniona przez reCAPTCHA. Obowiązują{' '}
        <a>Polityka Prywatności</a> i <a>Regulamin</a> Google.
      </span>
    ),
    log_in: {
      heading: {
        text: 'Zaloguj się',
        subtext: 'aby przejść do swoich zakładek',
      },
      switch_form: {
        text: 'Pierwszy raz tutaj?',
        link_label: 'Utwórz konto',
      },
      email_address: 'Adres email',
      password: 'Hasło',
      forgot_password: 'Resetowanie hasła',
      log_in: 'Zaloguj się',
      invalid_email_or_password: 'Nieprawidłowy email lub hasło',
    },
    sign_up: {
      heading: {
        text: 'Utwórz konto',
        subtext: 'Też nie lubimy papierkowej roboty...',
      },
      switch_form: {
        text: 'Masz już konto?',
        link_label: 'Zaloguj się',
      },
      email_address: 'Adres email',
      password: 'Hasło',
      about_email_address: 'Będziesz go używał(/a) do logownia.',
      username: 'Nick',
      about_username: 'Nick tworzy unikalny adres URL Twojego profilu.',
      about_password: (
        <span>
          <strong>Ważne:</strong> Twoje hasło szyfruje wszystkie prywatne
          zakładki i nie mogą być odzyskane jeśli go zapomnisz!
        </span>
      ),
      retype_password: 'Powtórz hasło',
      password_does_not_match: 'Hasła do siebie nie pasują.',
      password_hint: 'Wskazówka (opcjonalne)',
      about_password_hint:
        'Wskazówka dotycząca hasła może pomóc Tobie je sobie przypomnieć.',
      create_account: 'Utwórz konto',
      username_too_long: `Nick nie może przekraczać ${system_values.username_max_length} znaków.`,
      username_too_short: `Nick musi mieć przynajmniej ${system_values.username_min_length} znaków.`,
      password_too_short: `Hasło musi mieć co najmniej ${system_values.password_min_length} znaków.`,
      hint_too_long: `Wskazówka nie może przekraczać ${system_values.password_hint_max_length} znaków.`,
    },
  },
  app: {
    powered_by: 'W oparciu o',
    menu_items: {
      home: 'Strona główna',
      library: 'Biblioteka',
      notifications: 'Powiadomienia',
      activity: 'Aktywność',
    },
    library: {
      loading: 'Wczytywanie...',
      no_results: 'Brak wyników',
      end_of_resutls: 'Koniec wyników',
      clear_selected_tags: 'Wyczyść zaznaczone tagi',
      follow: 'Obserwuj',
      unfollow: 'Przestań obserwować',
      welcome: 'Witaj',
      send_feedback: 'Prześlij opinię, uzyskaj wsparcie',
      folders: 'Foldery',
      pinned: 'Przypięte',
      search: {
        placeholder: 'Szukaj w tytułach, notkach, tagach i linkach...',
        footer_tip: 'Tagi, filtry i zakres miesięcy wpływają na wyniki.',
        get_help: 'Uzyskaj wsparcie',
        type: 'Użyj',
        to_search: 'aby wyszukać',
        one_moment_please: 'Inicjalizacja...',
      },
      bookmark: {
        mark_as_unread: 'Nieprzeczytane',
        edit: 'Edytuj',
        archive: 'Archiwizuj',
        restore: 'Przywróć',
        delete: 'Usuń',
        pin: 'Przypnij',
        unpin: 'Odepnij',
        open_original_url: 'Oryginalny URL',
        open_snapshot: 'Otwórz kopię',
      },
      bookmark_updated: 'Zakładka została zaktualizowana',
      all_bookmarks: 'Wszystkie zakładki',
      drag_tag_here:
        'W Taaabs, foldery tworzy się przez układanie tagów jeden pod drugim. Przeciągnij i upuść aby rozpocząć.',
      tag_hierarchies_upated: 'Foldery zostały zaktualizowane',
      collapse_sidebar: 'Zwiń panel',
      link_is_now_pinned: 'Link został dodany do przypiętych',
      pin_has_been_removed: 'Link został usunięty z przypiętych',
      nothing_pinned: 'Nic nie jest tutaj przypięte',
      pinned_links_has_beed_updated: 'Przypięte linki zostały zaktualizowana',
      via_archive_org: 'Zawsze z kopii',
      use_snapshot: 'Odnośnik używa teraz kopii',
      use_original: 'Oryginalny link został przywrócony',
      sort_by_options: {
        added: 'dodania',
        edited: 'edycji',
        visited: 'wizyty',
        date: 'Data...',
        the_huggiest: 'Punktowane',
      },
      order_options: {
        newest: 'Najnowsze',
        oldest: 'Najstarsze',
      },
      range_of_months: 'Zakres miesięcy',
      range_not_available:
        'Wybór zakresu jest niedostępny dla bieżącej opcji sortowania',
      nothing_to_plot: 'Brak danych do wykresu',
      results_fit_in_one_month:
        'Wszystkie zakładki mieszczą się w jednym miesiącu',
      toolbar: {
        starred: 'Ulubione',
        unread: 'Nieprze...',
        archived: 'Archiwum',
      },
      errors: {
        tag_limit_reached: `Zakładka może mieć maksymalnie ${system_values.bookmark.tags.limit} słów kluczowych.`,
      },
    },
    upsert_popup: {
      create_bookmark: 'Dodaj zakładkę',
      edit_boomkark: 'Edytuj zakładkę',
      visibility: 'Widoczność',
      private: 'Prywatne',
      public: 'Publiczne',
      links: 'Odnośniki',
      link: {
        visibility: 'Widoczność',
        public: 'Publiczne',
        private: 'Prywatne',
        site: 'Ścieżka strony',
        open: 'Otwórz...',
        snapshot: 'Kopię',
        original_url: 'Oryginalny URL',
      },
      paste_url: 'Wklej URL',
      add_link: 'Dodaj odnośnik',
      title: 'Tytuł',
      enter_title: 'Wpisz tytuł',
      note: 'Notka',
      jot_something_down: 'Zanotuj coś...',
      tags: 'Tagi',
      tag: {
        visibility: 'Widoczność',
        public: 'Publiczne',
        private: 'Prywatne',
      },
      enter_tag_name: 'Wpisz słowo kluczowe',
      add_tag: 'Dodaj tag',
      cancel: 'Anuluj',
      save_changes: 'Zapisz zmiany',
      create: 'Dodaj zakładkę',
      error_title_too_long: `Tytuł nie może mieć więcej jak ${system_values.bookmark.title.max_length} znaków.`,
      error_note_too_long: `Notka nie może mieć więcej jak ${system_values.bookmark.note.max_length} znaków.`,
    },
  },
}

export default dictionary
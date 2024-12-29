export type Dictionary = {
  locale: 'en' | 'pl'
  landing: {
    menu_items: {
      updates: string
      help_center: string
      pricing: string
    }
    my_library: string
    about: {
      hero: {
        heading: {
          first_line: string
          second_line: string
        }
        subheading: string
        claim_username: string
        username: string
        ticks: React.ReactNode[]
        incentive: string
      }
    }
    pricing: {
      hero: {
        text: string
        subtext: React.ReactNode
      }
      monthly: string
      yearly: string
      per_month: string
      billed_monthly: string
      billed_yearly: string
      tiers: {
        name: string
        description: string
        bullets_heading: string
        bullets: string[]
        featured_text?: string
        button_label: string
      }[]
    }
  }
  auth: {
    field_is_required: string
    invalid_email: string
    recaptcha_privacy_notice: React.ReactNode
    something_went_wrong: string
    welcome: {
      heading: { text: string; subtext: string }
      switch_form: {
        text: string
        link_label: string
      }
    }
    log_in: {
      heading: { text: string; subtext: string }
      switch_form: {
        text: string
        link_label: string
      }
      email_address: string
      password: string
      forgot_password: string
      log_in: string
      invalid_email_or_password: string
    }
    sign_up: {
      heading: { text: string; subtext: string }
      switch_form: {
        text: string
        link_label: string
      }
      email_address: string
      password: string
      about_email_address: string
      username: string
      about_username: string
      retype_password: string
      password_does_not_match: string
      about_password: React.ReactNode
      password_hint: string
      about_password_hint: string
      create_account: string
      username_too_long: string
      username_too_short: string
      username_contains_incorrect_characters: string
      username_not_available: string
      password_too_short: string
      hint_too_long: string
    }
  }
  app: {
    header_desktop: {
      guest_username: string
      user_dropdown: {
        my_public_profile: string
        theme: string
        settings: string
        log_in: string
        create_account: string
        log_out: string
        about: string
        privacy_policy: string
        terms_of_service: string
        extension: {
          text: string
          subtext: string
          chrome: {
            text: string
            subtext: string
          }
        }
        bookmarklet: {
          text: string
          subtext: string
          button_label: string
        }
      }
    }
    menu_items: {
      home: string
      library: string
      chat: string
      activity: string
    }
    library: {
      loading: string
      no_results: string
      end_of_resutls: string
      clear_selected_tags: string
      clear_custom_range: string
      follow: string
      unfollow: string
      welcome: string
      send_feedback: string
      folders: string
      pinned: string
      rename: string
      delete: string
      search: {
        placeholder: string
        footer_tip: string
        get_help: string
        type: string
        to_search: string
        one_moment_please: string
      }
      bookmark: {
        pinned_to_sidebar: string
        use_snapshot: string
        unsorted: string
        edit: string
        archive: string
        restore: string
        delete: string
        open_original_url: string
        open_snapshot: string
      }
      bookmark_created: string
      bookmark_updated: string
      bookmark_archived: string
      bookmark_restored: string
      bookmark_deleted: string
      all_bookmarks: string
      drag_tag_here: string
      link_is_now_pinned: string
      pin_has_been_removed: string
      tag_hierarchies_upated: string
      collapse_sidebar: string
      nothing_pinned: string
      pinned_links_has_beed_updated: string
      via_snapshot: string
      use_snapshot: string
      use_original: string
      sort_by_options: {
        date: string
        the_huggiest: string
        added: string
        updated: string
        visited: string
      }
      order_options: {
        newest: string
        oldest: string
      }
      range_of_months: string
      range_not_available: string
      nothing_to_plot: string
      results_fit_in_one_month: string
      toolbar: {
        starred: string
        unsorted: string
        archived: string
      }
      errors: {
        tag_limit_reached: string
      }
    }
    upsert_modal: {
      create_bookmark: string
      edit_boomkark: string
      visibility: string
      private: string
      public: string
      links: string
      link: {
        visibility: string
        public: string
        private: string
        site: string
        open: string
        snapshot: string
        original_url: string
      }
      paste_url: string
      add_link: string
      title: string
      enter_title: string
      note: string
      jot_something_down: string
      tags: string
      tag_suggestions: {
        add: string
        recent_tags: string
      }
      enter_tag_name: string
      add_tag: string
      cancel: string
      save_changes: string
      create: string
      error_title_too_long: string
      error_note_too_long: string
      cover: string
    }
    change_visibility_modal: {
      change_visibility: string
      change_to_public_confirmation: string
      confirm: string
      cancel: string
    }
    delete_modal: {
      delete_bookmark: string
      untitled: string
      cancel: string
      delete: string
      are_you_sure: string
    }
    rename_tag_modal: {
      rename_tag: string
      cancel: string
      rename: string
      tag_is_too_short: string
      tag_is_too_long: string
    }
    edit_tags_modal: {
      edit_tags: string
      cancel: string
      update: string
      recent_tags: string
    }
    saves_modal: {
      header: string
      follow: string
      unfollow: string
      close: string
    }
  }
  settings: {
    settings: string
    menu: {
      general: string
      preferences: string
      subscription: string
      import: string
      backups: string
    }
    general: {
      username: {
        heading: {
          text: string
          subtext: string
        }
        change_username: string
        username_not_available: string
        username_left_unchanged: string
        username_changed: string
      }
      delete_account: {
        heading: {
          text: string
          subtext: string
        }
        guest_heading: {
          text: string
          subtext: string
        }
        delete_my_account_button_label: string
        modal: {
          header: string
          text: string
          cancel: string
          button_label: string
        }
      }
    }
  }
}

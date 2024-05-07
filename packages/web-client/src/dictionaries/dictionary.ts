export type Dictionary = {
  locale: 'en' | 'pl'
  landing: {
    menu_items: {
      updates: string
      help_center: string
      pricing: string
    }
    log_in: string
    open_app: string
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
      password_too_short: string
      hint_too_long: string
    }
  }
  app: {
    menu_items: {
      home: string
      bookmarks: string
      notifications: string
      activity: string
    }
    library: {
      follow: string
      unfollow: string
      welcome: string
      send_feedback: string
      folders: string
      pinned: string
      search: {
        placeholder: string
        footer_tip: string
        get_help: string
        type: string
        to_search: string
        one_moment_please: string
      }
      bookmark: {
        mark_as_unread: string
        edit: string
        archive: string
        restore: string
        delete: string
        pin: string
        unpin: string
        open_original_url: string
        open_snapshot: string
      }
      bookmark_updated: string
      all_bookmarks: string
      drag_tag_here: string
      link_is_now_pinned: string
      pin_has_been_removed: string
      tag_hierarchies_upated: string
      collapse_sidebar: string
      nothing_pinned: string
      pinned_links_has_beed_updated: string
      via_archive_org: string
      use_snapshot: string
      use_original: string
      sort_by_options: {
        date: string
        the_huggiest: string
        added: string
        edited: string
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
    }
  }
}

import { system_values } from '@shared/constants/system-values'
import { Dictionary } from './dictionary'

const dictionary: Dictionary = {
  locale: 'en',
  landing: {
    menu_items: {
      help_center: 'Help center',
      pricing: 'Pricing',
      updates: 'Updates',
    },
    my_library: 'My library',
    about: {
      hero: {
        heading: {
          first_line: 'Smiles start',
          second_line: 'with shared links',
        },
        subheading:
          'Save bookmarks to your personal library. Follow like-minded.',
        claim_username: 'Claim username',
        username: 'username',
        ticks: [
          <>
            <strong>End-to-end encryption</strong> of private bookmarks
          </>,
          <>
            <strong>Unlimited</strong> bookmarks and tags
          </>,
        ],
        incentive: '30 seconds or less',
      },
    },
    pricing: {
      hero: {
        text: 'Pricing',
        subtext: 'Start free, upgrade anytime. No credit card required.',
      },
      monthly: 'Monthly',
      yearly: 'Yearly',
      billed_monthly: 'billed monthly',
      billed_yearly: 'billed yearly',
      per_month: 'per month',
      tiers: [
        {
          name: 'Free',
          description: 'Start building your personal library',
          bullets_heading: "What's included:",
          bullets: [
            'Unlimited bookmarks & tags',
            'Flash search',
            'End-to-end encryption',
          ],
          button_label: 'Start for free',
        },
        {
          name: 'Pro',
          description: 'Get the most out of Taaabs',
          bullets_heading: 'Level-up with:',
          bullets: ['PRO badge', 'Highlights', 'Shorter username'],
          button_label: 'Subscribe now',
        },
      ],
    },
  },
  auth: {
    field_is_required: "Field can't be empty.",
    invalid_email: 'Entered email is invalid.',
    something_went_wrong: 'Something went wrong... Try again later.',
    recaptcha_privacy_notice: (
      <span>
        This site is protected by reCAPTCHA and the Google <a>Privacy Policy</a>{' '}
        and <a>Terms of Service</a> apply.
      </span>
    ),
    welcome: {
      heading: {
        text: 'Welcome!',
        subtext:
          "Let's begin by creating a guest profile and explore all the features in action.",
      },
      switch_form: {
        text: 'Already a member?',
        link_label: 'Login',
      },
    },
    log_in: {
      heading: {
        text: 'Log in',
        subtext: 'to go to your bookmarks',
      },
      switch_form: {
        text: 'New around here?',
        link_label: 'Create account',
      },
      email_address: 'Email address',
      password: 'Password',
      forgot_password: 'Forgot password?',
      log_in: 'Log in',
      invalid_email_or_password: 'Invalid email or password',
    },
    sign_up: {
      heading: {
        text: 'Sign up',
        subtext: 'We hate paperwork, too.',
      },
      switch_form: {
        text: 'Already have an account?',
        link_label: 'Log in',
      },
      email_address: 'Email address',
      password: 'Password',
      about_email_address: "You'll use your email address to log in.",
      username: 'Username',
      about_username: 'Username determines your public profile URL.',
      about_password: (
        <span>
          <strong>Important:</strong> Your password encrypts all your private
          bookmarks and can't be recovered if you forget it!
        </span>
      ),
      retype_password: 'Retype password',
      password_does_not_match: 'Passwords does not match.',
      password_hint: 'Password hint (optional)',
      about_password_hint:
        'A password hint can help you remember your password if you forget it.',
      create_account: 'Create account',
      username_too_long: `Username exceeds ${system_values.username_max_length}-character limit.`,
      username_too_short: `Username must have at least ${system_values.username_min_length} characters.`,
      username_contains_incorrect_characters:
        'Username contains incorrect characters.',
      username_not_available: 'Given username is taken.',
      password_too_short: `Password must be at least ${system_values.password_min_length}-character long.`,
      hint_too_long: `Given hint exceeds ${system_values.password_hint_max_length}-character limit.`,
    },
  },
  app: {
    header_desktop: {
      guest_username: 'Guest',
      user_dropdown: {
        my_public_profile: 'My profile',
        theme: 'Theme',
        settings: 'Settings',
        log_in: 'Log in',
        create_account: 'Create account',
        log_out: 'Log out',
        about: 'About',
        privacy_policy: 'Privacy policy',
        terms_of_service: 'Terms of service',
        extension: {
          text: 'Extension',
          subtext: 'Add official add-on to your browser',
          chrome: {
            text: 'Available in the',
            subtext: 'Chrome Web Store',
          },
        },
        bookmarklet: {
          text: 'Bookmarklet',
          subtext:
            'Simply drag this button to your bookmarks bar and click from any page',
          button_label: 'Save to taaabs',
        },
      },
    },
    menu_items: {
      home: 'Home',
      library: 'Library',
      chat: 'Chat',
      activity: 'Activity',
    },
    library: {
      loading: 'Loading...',
      no_results: 'No results',
      end_of_resutls: 'End of results',
      clear_selected_tags: 'Clear selected tags',
      clear_custom_range: 'Clear custom range',
      follow: 'Follow',
      unfollow: 'Unfollow',
      welcome: 'Howdy',
      send_feedback: 'Send feedback ↗',
      folders: 'Folders',
      pinned: 'Pinned',
      delete: 'Delete',
      rename: 'Rename',
      search: {
        placeholder: 'Search bookmarks...',
        footer_tip: 'Tags, filters and custom range affect results.',
        get_help: 'Search syntax tips',
        type: 'Type',
        to_search: 'to search',
        one_moment_please: 'One moment please...',
      },
      bookmark: {
        pinned_to_sidebar: 'Pinned',
        use_snapshot: 'Use snapshot',
        unsorted: 'Unsorted',
        edit: 'Edit',
        archive: 'Archive',
        restore: 'Restore',
        delete: 'Delete',
        open_original_url: 'Open original URL',
        open_snapshot: 'Open snapshot',
      },
      bookmark_created: 'Bookmark has been created',
      bookmark_updated: 'Bookmark has been updated',
      bookmark_archived: 'Bookmark has been archived',
      bookmark_restored: 'Bookmark has been restored',
      bookmark_deleted: 'Bookmark has been deleted',
      all_bookmarks: 'All bookmarks',
      drag_tag_here:
        'In Taaabs, folders are built by stacking tags on one another. Begin by dragging a tag over.',
      tag_hierarchies_upated: 'Folders has been updated',
      collapse_sidebar: 'Collapse sidebar',
      link_is_now_pinned: 'Link is now pinned',
      pin_has_been_removed: 'Pin has been removed',
      nothing_pinned: 'Nothing is pinned here',
      pinned_links_has_beed_updated: 'Pinned links has been updated',
      via_snapshot: 'Set redirect',
      use_snapshot: 'Link is now using snapshot',
      use_original: 'Link is back to its original URL',
      sort_by_options: {
        date: 'Date...',
        views: 'Views',
        points: 'Points',
        added: 'added',
        visited: 'visited',
        updated: 'updated',
      },
      order_options: {
        newest: 'Newest',
        oldest: 'Oldest',
      },
      range_of_months: 'Range of months',
      range_not_available:
        'Range selection is unavailable for current sort option',
      nothing_to_plot: 'There is nothing to plot',
      results_fit_in_one_month: 'Results fit in one month',
      toolbar: {
        starred: 'Starred',
        unsorted: 'Unsorted',
        archived: 'Archived',
      },
      errors: {
        tag_limit_reached: `Bookmark can have at most ${system_values.bookmark.tags.limit} tags`,
      },
    },
    upsert_modal: {
      create_bookmark: 'Create bookmark',
      edit_boomkark: 'Edit bookmark',
      visibility: 'Visibility',
      private: 'Private',
      public: 'Public',
      links: 'Links',
      link: {
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
        site: 'Site path',
        open: 'Open',
        snapshot: 'Snapshot',
        original_url: 'Original URL',
      },
      paste_url: 'Paste URL',
      add_link: 'Add link',
      title: 'Title',
      enter_title: 'Enter title',
      note: 'Note',
      jot_something_down: 'Jot something down...',
      tags: 'Tags',
      tag_suggestions: {
        add: 'Add',
        recent_tags: 'Recent tags',
      },
      enter_tag_name: 'Enter tag name',
      add_tag: 'Add tag',
      cancel: 'Cancel',
      save_changes: 'Update',
      create: 'Create',
      error_title_too_long: `Title should be no longer than ${system_values.bookmark.title.max_length} characters.`,
      error_note_too_long: `Note should be no longer than ${system_values.bookmark.note.max_length} characters.`,
      cover: 'Cover',
    },
    change_visibility_modal: {
      change_visibility: 'Change visibility',
      change_to_public_confirmation:
        'Are you sure you want to make this bookmark public?',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    delete_modal: {
      delete_bookmark: 'Delete bookmark',
      untitled: 'Untitled',
      cancel: 'Cancel',
      delete: 'Delete',
      are_you_sure: 'This will permanently delete',
    },
    rename_tag_modal: {
      rename_tag: 'Rename tag',
      rename: 'Rename',
      cancel: 'Cancel',
      tag_is_too_short: 'Tag must have at least 1 character',
      tag_is_too_long: 'Entered tag is too long',
    },
    edit_tags_modal: {
      edit_tags: 'Edit tags',
      update: 'Update',
      cancel: 'Cancel',
      recent_tags: 'Recent tags',
    },
    saves_modal: {
      header: 'Saves',
      follow: 'Follow',
      unfollow: 'Unfollow',
      close: 'Close',
    },
  },
  settings: {
    settings: 'Settings',
    menu: {
      general: 'General',
      preferences: 'Preferences',
      subscription: 'Subscription',
      import: 'Import',
      backups: 'Backups',
    },
    general: {
      username: {
        heading: {
          text: 'Username',
          subtext: 'Username determines your public profile URL.',
        },
        change_username: 'Change username',
        username_changed: 'Username has been changed',
        username_not_available: 'Given username is taken.',
        username_left_unchanged: 'Username is left unchanged',
      },
      delete_account: {
        heading: {
          text: 'Delete account',
          subtext:
            'Deleting your account will remove all your data from our servers. Download backup of your bookmarks before proceeding. <strong>This cannot be undone.</strong>',
        },
        guest_heading: {
          text: 'Delete guest account',
          subtext:
            'Deleting your account will remove all your data from our servers. Download backup of your bookmarks before proceeding. <strong>This cannot be undone.</strong>',
        },
        delete_my_account_button_label: 'Delete my account',
        modal: {
          header: 'Delete account?',
          text: 'Heads up! This cannot be undone.',
          cancel: 'Cancel',
          button_label: 'Delete account',
        },
      },
    },
  },
}

export default dictionary

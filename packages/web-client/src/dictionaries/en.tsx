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
    log_in: 'Log in',
    open_app: 'Open app',
    about: {
      hero: {
        heading: {
          first_line: 'The huggiest',
          second_line: 'social bookmarking',
        },
        subheading:
          'Easy to use, privacy-first way to organize, share and discover web bookmarks',
        claim_username: 'Claim username',
        username: 'username',
        ticks: [
          <>
            <strong>End-to-end encryption</strong> of private bookmarks
          </>,
          <>
            <strong>Free to try</strong> for as long as you'd like
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
            'Unlimited bookmarks',
            'Unlimited tags',
            'Zero-knowledge encryption™',
          ],
          button_label: 'Start for free',
        },
        {
          name: 'Surfer',
          description: 'Affordable plan with our must haves',
          bullets_heading: 'Everything in Free, plus:',
          bullets: [
            'Starred, unread filters',
            'Sort by visit, update dates',
            'Multi-link bookmarks',
          ],
          button_label: 'Subscribe to Surfer',
        },
        {
          name: 'Pro',
          description: 'Get the most out of Taaabs',
          bullets_heading: 'Everything in Surfer, plus:',
          featured_text: 'Recommended',
          bullets: [
            'Unlock all features ✨',
            'Get a PRO badge',
            'Claim shorter username',
          ],
          button_label: 'Subscribe to Pro',
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
      password_too_short: `Password must be at least ${system_values.password_min_length}-character long.`,
      hint_too_long: `Given hint exceeds ${system_values.password_hint_max_length}-character limit.`,
    },
  },
  app: {
    powered_by: 'Powered by',
    menu_items: {
      home: 'Home',
      library: 'My library',
      notifications: 'Notifications',
      activity: 'Activity',
    },
    library: {
      loading: 'Loading...',
      no_results: 'No results',
      end_of_resutls: 'End of results',
      clear_selected_tags: 'Clear selected tags',
      follow: 'Follow',
      unfollow: 'Unfollow',
      welcome: 'Howdy',
      send_feedback: 'Send feedback, get help',
      folders: 'Folders',
      pinned: 'Pinned',
      search: {
        placeholder: 'Search in titles, notes, tags and links...',
        footer_tip: 'Tags, filters and custom range affect results.',
        get_help: 'Get help',
        type: 'Type',
        to_search: 'to search',
        one_moment_please: 'One moment please...',
      },
      bookmark: {
        mark_as_unread: 'Mark as unread',
        edit: 'Edit',
        archive: 'Archive',
        restore: 'Restore',
        delete: 'Delete',
        pin: 'Pin',
        unpin: 'Unpin',
        open_original_url: 'Open original URL',
        open_snapshot: 'Open snapshot',
      },
      bookmark_updated: 'Bookmark has been updated',
      all_bookmarks: 'All bookmarks',
      drag_tag_here:
        'In Taaabs, folders are built by stacking tags on one another. Begin by dragging a tag over.',
      tag_hierarchies_upated: 'Folders has been updated',
      collapse_sidebar: 'Collapse sidebar',
      link_is_now_pinned: 'Link is now pinned',
      pin_has_been_removed: 'Pin has been removed',
      nothing_pinned: 'Nothing is pinned here',
      pinned_links_has_beed_updated: 'Pinned links has been updated',
      via_archive_org: 'Use snapshot',
      use_snapshot: 'Link is now using snapshot',
      use_original: 'Link is back to its original URL',
      sort_by_options: {
        date: 'Date...',
        the_huggiest: 'The huggiest!',
        added: 'added',
        visited: 'visited',
        edited: 'edited',
      },
      order_options: {
        newest: 'Newest',
        oldest: 'Oldest',
      },
      range_of_months: 'Range of months',
      range_not_available:
        'Range selection is unavailable for current sort option',
      nothing_to_plot: 'There is nothing to plot',
      results_fit_in_one_month: 'Results fit in ont month',
      toolbar: {
        starred: 'Starred',
        unread: 'Unread',
        archived: 'Archived',
      },
      errors: {
        tag_limit_reached: `Bookmark can have at most ${system_values.bookmark.tags.limit} tags`,
      },
    },
    upsert_popup: {
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
      tags: 'tags',
      tag: {
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
      },
      enter_tag_name: 'Enter tag name',
      add_tag: 'Add tag',
      cancel: 'Cancel',
      save_changes: 'Save changes',
      create: 'Create',
      error_title_too_long: `Title should be no longer than ${system_values.bookmark.title.max_length} characters.`,
      error_note_too_long: `Note should be no longer than ${system_values.bookmark.note.max_length} characters.`,
    },
  },
}

export default dictionary
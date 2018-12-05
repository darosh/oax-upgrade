import defaultConfiguration from '../data/configuration'

// window.OAX = window.OAX || {}

// export const configuration = window.OAX.cfg = {
export const configuration = {
  ...defaultConfiguration,
  // ...(window.OAX.cfg || {}),
  ...{
    components: {
      dialogHeaders: process.env.VUE_APP_FEATURE_DIALOG_HEADERS,
      dialogMethods: process.env.VUE_APP_FEATURE_DIALOG_METHODS,
      dialogStatuses: process.env.VUE_APP_FEATURE_DIALOG_STATUSES,
      pageHeaders: process.env.VUE_APP_FEATURE_PAGE_HEADERS,
      pageMethods: process.env.VUE_APP_FEATURE_PAGE_METHODS,
      pageStatuses: process.env.VUE_APP_FEATURE_PAGE_STATUSES,
      pageStats: process.env.VUE_APP_FEATURE_PAGE_STATS,
      pageAbout: process.env.VUE_APP_FEATURE_PAGE_ABOUT,
      pageAboutKeyboard: process.env.VUE_APP_FEATURE_PAGE_ABOUT_KEYBOARD,
      github: process.env.VUE_APP_FEATURE_GITHUB,
      edit: process.env.VUE_APP_FEATURE_EDIT,
      directory: process.env.VUE_APP_FEATURE_DIRECTORY,
      editor: process.env.VUE_APP_FEATURE_EDITOR,
      markdown: process.env.VUE_APP_FEATURE_MARKDOWN,
      highlight: process.env.VUE_APP_FEATURE_HIGHLIGHT
    }
  }
}

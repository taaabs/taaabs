const fs = require('fs')
const path = require('path')

/**
 * 1. Prepare updated manifest.
 * 2. Copy dist as dist-firefox.
 * 3. Replace manifest.
 */

// Read the original manifest.json
const manifest_path = path.join(__dirname, 'src', 'manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifest_path, 'utf8'))

// Change manifest version
const firefox_manifest = { ...manifest }
delete firefox_manifest.manifest_version
firefox_manifest.manifest_version = 2

// Replace service_worker with background.scripts
if (firefox_manifest.background && firefox_manifest.background.service_worker) {
  firefox_manifest.background = {
    scripts: [firefox_manifest.background.service_worker],
    persistent: true,
  }
}

// Remove action (Firefox uses browser_action)
firefox_manifest.browser_action = firefox_manifest.action
delete firefox_manifest.action

// Remove commands (unsupported in Firefox)
delete firefox_manifest.commands

// Adjust permissions
firefox_manifest.permissions = firefox_manifest.permissions.filter(
  (p) => p != 'alarms',
)

// Add '<all_urls>' permission so that the extension can request favicons and cover
// and not worry about CORS
firefox_manifest.permissions.push('<all_urls>')

// Adjust content_scripts matches
if (firefox_manifest.content_scripts) {
  firefox_manifest.content_scripts.forEach((script) => {
    if (script.matches) {
      script.matches = script.matches.map((match) => {
        if (match == '<all_urls>') {
          return '*://*/*'
        }
        return match
      })
    }
  })
}

// Add browser_specific_settings for Firefox
firefox_manifest.browser_specific_settings = {
  gecko: {
    id: 'heytaaabs@gmail.com',
    strict_min_version: '120.0',
  },
}

// Modify web_accessible_resources for Firefox
if (firefox_manifest.web_accessible_resources) {
  firefox_manifest.web_accessible_resources =
    firefox_manifest.web_accessible_resources[0].resources
}

// Create dist-firefox directory if it doesn't exist
const firefox_dist_dir = path.join(__dirname, 'dist-firefox')
if (!fs.existsSync(firefox_dist_dir)) {
  fs.mkdirSync(firefox_dist_dir)
}

// Copy the contents of the dist directory to dist-firefox
const dist_dir = path.join(__dirname, 'dist')
fs.cpSync(dist_dir, firefox_dist_dir, { recursive: true })

// Write the modified manifest to manifest.json in dist-firefox
const firefox_manifest_path = path.join(
  __dirname,
  'dist-firefox',
  'manifest.json',
)
fs.writeFileSync(
  firefox_manifest_path,
  JSON.stringify(firefox_manifest, null, 2),
)

console.log('[create-firefox-build] Firefox build created successfully')

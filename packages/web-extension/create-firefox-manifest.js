const fs = require('fs')
const path = require('path')

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
  }
}

// Remove action (Firefox uses browser_action)
firefox_manifest.browser_action = firefox_manifest.action
delete firefox_manifest.action

// Adjust permissions
// Remove 'background' permission if present
firefox_manifest.permissions = firefox_manifest.permissions.filter(
  (perm) => perm != 'background',
)

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
    id: 'com.taaabs', // Replace with your actual Firefox extension ID
    strict_min_version: '57.0', // Specify the minimum supported Firefox version
  },
}

// Write the modified manifest to a new file
const firefox_manifest_path = path.join(
  __dirname,
  'dist',
  'manifest-firefox.json',
)
fs.writeFileSync(
  firefox_manifest_path,
  JSON.stringify(firefox_manifest, null, 2),
)

console.log('Firefox manifest created successfully.')

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const prefix = '[create-extension-zips]'
const log = (message) => console.log(`${prefix} ${message}`)
const errorLog = (message) => console.error(`${prefix} ${message}`)

/**
 * Gets the current version from the manifest.json file
 * @returns {string} The version string
 */
function get_version() {
  const manifest_path = path.join(__dirname, 'src', 'manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifest_path, 'utf8'))
  return manifest.version
}

/**
 * Creates a ZIP archive from a directory
 * @param {string} source_dir - The source directory to zip
 * @param {string} output_path - The output path for the ZIP file
 * @returns {Promise<void>}
 */
function create_zip_from_directory(source_dir, output_path) {
  return new Promise((resolve, reject) => {
    // Ensure the source directory exists
    if (!fs.existsSync(source_dir)) {
      reject(new Error(`Source directory does not exist: ${source_dir}`))
      return
    }

    const output = fs.createWriteStream(output_path)
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    })

    output.on('close', () => {
      resolve()
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(output)
    archive.directory(source_dir, false)
    archive.finalize()
  })
}

/**
 * Deletes old ZIP archives except for the current version
 * @param {string} current_version - The current version to keep
 * @returns {void}
 */
function delete_old_zip_archives(current_version) {
  const files = fs.readdirSync(__dirname)
  const zipPattern = /extension-(.+)-(chrome|firefox)\.zip$/
  let deleted_files = 0

  files.forEach((file) => {
    const match = file.match(zipPattern)
    if (match && match[1] != current_version) {
      const filePath = path.join(__dirname, file)
      fs.unlinkSync(filePath)
      deleted_files++
    }
  })
}

/**
 * Main function to create ZIP archives for both Chrome and Firefox extensions
 */
async function main() {
  const base_dir = __dirname
  const dist_dir = path.join(base_dir, 'dist')
  const firefox_dist_dir = path.join(base_dir, 'dist-firefox')
  const version = get_version()

  try {
    // Delete old archives before creating new ones
    delete_old_zip_archives(version)

    await create_zip_from_directory(
      dist_dir,
      path.join(base_dir, `extension-${version}-chrome.zip`),
    )

    await create_zip_from_directory(
      firefox_dist_dir,
      path.join(base_dir, `extension-${version}-firefox.zip`),
    )

    log(`Successfully created ZIP archives for version ${version}`)
  } catch (error) {
    errorLog(`Error creating ZIP archives: ${error}`)
    process.exit(1)
  }
}

main()

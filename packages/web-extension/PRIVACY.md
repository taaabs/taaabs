# Privacy policy for Taaabs browser extension

Effective Date: 17 Oct 2024

This Privacy Policy describes Taaabs's commitment to unmatched user privacy by employing zero-knowledge practices.

## 1. Our core privacy principles

- **No ads:** We are committed to providing a clean and ad-free experience.
- **No trackers:** The Taaabs extension does not track your browsing activity or its own usage. **Your privacy is paramount.**
- **End-to-End Encryption:** Links saved to your personal library are protected with **state-of-the-art end-to-end encryption**, ensuring that **only you can access them**.

## 2. Information we collect

The extension does not collect information of any kind.

## 3. Privacy considerations

- **Webpage content:** The extension processes text of websites or screenshots in a vision mode **100% locally**.
- **AI communication:** The Extension facilitates communication with your chosen AI assistant via browser's built-in channels.
- **Links:** Plain URLs are never sent to Taaabs.

## 4. Auth data

If you decide to sign in, the extension uses your auth data in the following ways:

- **Facilitating encrypted link saving:** If you sign in, your access token and encryption key are stored **locally** in your browser. This is essential for encrypting your links before they are saved to your personal library on taaabs.com. **This information never leaves your browser and is never transmitted to our servers.**

- **Checking if a link is already saved:** To provide the functionality of checking if the current URL is already saved in your library, the extension generates a cryptographically secure hash (SHA256) of the URL (combined with encryption key) sends this hash to taaabs.com. **This allows the server to check for a match without ever receiving the actual URL.**

- **Storing encrypted links:** When you save a link, it's encrypted locally using your encryption key and only then sent to taaabs.com for storage. We only store the encrypted version of your links, **we cannot access their readable form**. **Our servers are located in the EU.**

## 5. How we share your information

_(Applies to signed in user.)_ Your personal information (such as your email address) is not shared with any third parties, unless legally required to do so. We are committed to protecting your privacy and faciliate encryption at rest.

## 6. Data security

We take data security very seriously. Your private bookmarks are **end-to-end encrypted** using **AES-CBC 256-bit encryption and Argon2id key derivation**, following the proven implementation of Bitwarden™. This ensures that **only you can decrypt and access your saved links**. While we use robust encryption, please remember that the security of your data also depends on the security of your own browser and system. We cannot control vulnerabilities or compromises of your browser or operating system.

Taaabs is committed to transparency. **The source code for the Taaabs browser extension is publicly available** under the [AGPLv3](https://github.com/taaabs/taaabs/blob/master/packages/web-extension/LICENSE) license at [GitHub](https://github.com/taaabs/taaabs/tree/master/packages/web-extension). We encourage community review and contributions.

## 7. Your choices

- **Sign in:** You can choose whether or not to sign in. Signing in enables the saving of encrypted links to your personal library.
- **Data deletion:** You can delete your locally stored access token and encryption key at any time by signing out of the Extension. You can also delete saved links from your taaabs.com library through the website interface.

## 8. Children's privacy

Taaabs is not intended for use by children under the age of 13.

## 9. Changes to this privacy policy

This Privacy Policy may be updated periodically. We will post the revised Privacy Policy here and encourage you to review it regularly. Any changes are effective upon posting. We are committed to maintaining our zero-knowledge practices and pledge never to change them in any update to this policy.

## 10. Contact us

If you have any questions, please contact us at [heytaaabs@gmail.com](heytaaabs@gmail.com) or visit [discussions tab](https://github.com/taaabs/taaabs/discussions).

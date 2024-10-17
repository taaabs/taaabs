# Privacy policy for Taaabs browser extension

Effective Date: 17 Oct 2024

This Privacy Policy explains how Taaabs handles information when you use our browser extension. We are committed to protecting your privacy and data security.

## **1. Our core privacy principles:**

- **No Tracking:** The Taaabs extension does not collect any usage data or telemetry. We do not track your browsing activity or any interactions with the extension. Your privacy is paramount.
- **No Ads:** We are committed to providing a clean and ad-free experience.
- **End-to-End Encryption:** Links saved to your personal library are protected with state-of-the-art end-to-end encryption, ensuring that only you can access them.

## **2. Information we _do not_ collect:**

- **Webpage content:** The extension processes text of websites or screenshots in a vision mode 100% locally.
- **AI communication:** The Extension facilitates communication with your chosen AI assistant via browser's built-in channels.
- **Decrypted links:** We never have access to the decrypted versions of your saved links. They are encrypted locally end-to-end using your encryption key before being transmitted to taaabs.com.
- **Browsing History:** We do not track or collect your browsing history in any way.
- **Advertising or tracking:** We collect absolutely no data for advertising or tracking purposes.

## 3. How the extension uses your auth data

The Taaabs extension uses your auth data in the following ways:

- **Facilitating encrypted link saving:** If you sign in, your access token and encryption key are stored **locally** in your browser. This is essential for encrypting your links before they are saved to your personal library on taaabs.com. This information never leaves your browser and is never transmitted to our servers.

- **Checking if a link is already saved:** To provide the functionality of checking if the current URL is already saved in your library, the extension generates a cryptographically secure hash of the URL locally and sends this hash to taaabs.com. This allows the server to check for a match without ever receiving or storing the actual URL. No information about the URL itself is transmitted other than this anonymized hash.

- **Storing encrypted links:** When you save a link, it's encrypted locally using your encryption key and then sent to taaabs.com for storage. We only store the encrypted version of your links; we cannot access the decrypted content. Our servers are located in the EU.

## **4. How we share your information**

We do not share your personal information (e.g. e-mail address of your account) with third parties, unless required by law.

## **5. Data security**

We take data security very seriously. Your private bookmarks are end-to-end encrypted using AES-CBC 256-bit encryption and Argon2id key derivation, following the proven implementation of Bitwarden™. This ensures that only you can decrypt and access your saved links. While we use robust encryption, please remember that the security of your data also depends on the security of your own browser and system. We cannot control vulnerabilities or compromises of your browser or operating system.

Taaabs is committed to transparency. The source code for the Taaabs browser extension is publicly available under the [AGPLv3](https://github.com/taaabs/taaabs/blob/master/packages/web-extension/LICENSE) license at [GitHub](https://github.com/taaabs/taaabs/tree/master/packages/web-extension). We encourage community review and contributions.

## **6. Your choices**

- **Sign-In:** You can choose whether or not to sign in to the Extension. Signing in enables the saving of encrypted links to your taaabs.com library.
- **Data Deletion:** You can delete your locally stored access token and encryption key at any time by signing out of the Extension. You can also delete saved links from your taaabs.com library through the website interface.

## **7. Children's privacy**

Taaabs is not intended for use by children under the age of 13.

## **8. Changes to this privacy policy**

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

## **9. Contact us**

If you have any questions, please contact us at [heytaaabs@gmail.com](heytaaabs@gmail.com) or visit [discussions tab](https://github.com/taaabs/taaabs/discussions).

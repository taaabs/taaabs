## Privacy policy for Taaabs browser extension

Effective Date: 17 Oct 2024

This Privacy Policy describes how Taaabs collects, uses, and shares information when you use our browser extension. We are fundamentally committed to protecting your privacy and ensuring the security of your data.

## **1. Our core privacy principles:**

- **No Tracking:** We firmly believe in user privacy. We do not track your browsing history, the websites you visit, or any other online activity. We do not collect or store any data related to your browsing behavior.
- **No Ads:** We are committed to providing a clean and ad-free experience. The Extension does not display any advertisements and will never incorporate advertising features.
- **End-to-End Encryption:** Lins saved to your personal library on taaabs.com are protected with strong end-to-end encryption, ensuring that only you can access them.

## **2. Information we collect**

### **2.1 Information you provide (locally stored):**

- **Optional Sign-In Data (Local Only):** If you choose to sign in to the Extension, we _locally_ store your access token and encryption key. This information is **never** transmitted to our servers and is only used to facilitate saving encrypted links to your personal library on taaabs.com.

### **2.2 Information we do not collect:**

- **Webpage Content:** The Extension allows you to locally grab text from webpages. We do not collect it.
- **AI Communication:** The Extension facilitates communication with your chosen AI assistant via your browser's built-in channels. We do not collect any data related to these communications.
- **Decrypted Links:** We never have access to the decrypted versions of your saved links. They are encrypted locally before being transmitted to taaabs.com.
- **Browsing History:** We do not track or collect your browsing history in any way.
- **Anything Used for Advertising or Tracking:** We collect absolutely no data for advertising or tracking purposes.

## 3. How the extension uses your auth data

The Taaabs extension uses your auth data in the following ways:

- **Facilitating encrypted link saving:** If you sign in, your access token and encryption key are stored **locally** in your browser. This is essential for encrypting your links before they are saved to your personal library on taaabs.com. This information never leaves your browser and is never transmitted to our servers.

- **Checking if a link is already saved:** To provide the functionality of checking if the current URL is already saved in your library, the extension generates a cryptographically secure hash of the URL locally and sends this hash to taaabs.com. This allows the server to check for a match without ever receiving or storing the actual URL. No information about the URL itself is transmitted other than this anonymized hash.

- **Storing encrypted links:** When you save a link, it's encrypted locally using your unique encryption key and then sent to taaabs.com for storage. We only store the encrypted version of your links; we cannot access the decrypted content. Our servers are located in the EU.

## **4. How we share your information**

We do not share your personal information (e.g. e-mail address of your account if you decided to sign in) with third parties, unless required by law.

## **5. Data security**

We take data security very seriously. Your private bookmarks are end-to-end encrypted using AES-CBC 256-bit encryption and Argon2id key derivation, following the proven implementation of Bitwarden™. This ensures that only you can decrypt and access your saved links. While we use robust encryption, please remember that the security of your data also depends on the security of your own browser and system. We cannot control vulnerabilities or compromises of your browser or operating system.

Taaabs is committed to transparency. The source code for the Taaabs browser extension is publicly available under the [AGPLv3](https://github.com/taaabs/taaabs/blob/master/packages/web-extension/LICENSE) license at [GitHub](https://github.com/taaabs/taaabs/tree/master/packages/web-extension). We encourage community review and contributions.

## **6. Your choices**

- **Sign-In:** You can choose whether or not to sign in to the Extension. Signing in enables the saving of encrypted links to your taaabs.com library.
- **Data Deletion:** You can delete your locally stored access token and encryption key at any time by signing out of the Extension. You can also delete saved links from your taaabs.com library through the website interface.

## **7. Children's privacy**

The Extension is not intended for use by children under the age of 13.

## **8. Changes to this privacy policy**

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

## **9. Contact us**

If you have any questions, please contact us at [heytaaabs@gmail.com](heytaaabs@gmail.com) or visit [discussions tab](https://github.com/taaabs/taaabs/discussions).

import { showToast } from "./toast.jsx";

/**
 * Sends a result card to WhatsApp — the image and its caption together.
 *
 * `https://wa.me/?text=` carries text only. There is no URL a web page can
 * open that hands WhatsApp an image, which is why sharing used to arrive as a
 * bare message with the card left behind. The one way a web app can send a
 * file is the Web Share API: it opens the phone's share sheet with the image
 * attached, the learner picks WhatsApp, and WhatsApp takes the text as the
 * caption. Supported by Chrome on Android and Safari on iOS — where nearly all
 * learners are — and by Chrome and Edge on desktop.
 *
 * Two constraints decide how this is written:
 *
 * - **The share must happen inside the tap.** Browsers only allow
 *   `navigator.share` as a direct response to a user gesture, and Safari
 *   refuses it if anything was awaited first. So the card is converted to a
 *   File synchronously rather than through `fetch(dataUrl)`, and the share is
 *   the first thing awaited.
 * - **Where files cannot be shared** (Firefox on desktop, older browsers), the
 *   message still opens in WhatsApp and the card is saved to the device, with
 *   a note to attach it — rather than silently dropping the image as before.
 */

// Synchronous by design — see above. A data URL is `data:<type>;base64,<data>`.
const dataUrlToFile = (dataUrl, filename) => {
  try {
    const [header, base64] = dataUrl.split(",");
    const type = header.match(/^data:([^;]+)/)?.[1] || "image/png";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type });
  } catch {
    return null;
  }
};

const downloadImage = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openWhatsAppWithText = (message) =>
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");

/**
 * @param {Object} params
 * @param {string|null} params.imageDataUrl - The generated card, or null if it
 *   failed to generate (the message is then shared on its own).
 * @param {string} params.message  - Sent as the image's caption.
 * @param {string} params.filename - Name of the image file.
 */
export const shareResultToWhatsApp = async ({ imageDataUrl, message, filename }) => {
  const file = imageDataUrl ? dataUrlToFile(imageDataUrl, filename) : null;
  const canShareFile = Boolean(file && navigator.canShare?.({ files: [file] }));

  if (canShareFile) {
    try {
      await navigator.share({ files: [file], text: message });
      return;
    } catch (error) {
      // Closing the share sheet is a choice, not a failure.
      if (error?.name === "AbortError") return;
      // Anything else falls through to the manual route below.
    }
  }

  openWhatsAppWithText(message);
  if (imageDataUrl) {
    downloadImage(imageDataUrl, filename);
    showToast.info("Your result card was saved — attach it to your WhatsApp message.");
  }
};

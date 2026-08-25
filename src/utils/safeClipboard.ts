/**
 * Safe clipboard copy utility with fallback for insecure/unsupported browser contexts
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try standard modern navigator.clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Modern clipboard copy failed, trying execCommand fallback:', err);
    }
  }

  // Fallback for older browsers, non-HTTPS, or strict iframe sandboxes
  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('All clipboard copy mechanisms failed:', err);
  }

  return false;
}

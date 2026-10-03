/* Syncare: chat bubble in the launcher and the chat avatars instead of the
   boxed wordmark. Re-applied whenever an older layer redraws them. */
(() => {
  'use strict';
  if (document.body?.dataset?.cosmeticsDemo !== 'syncare') return;
  const root = document.querySelector('#cosmetics-root');
  const BUBBLE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
    + '<path d="M24 9c9.4 0 17 6.3 17 14.2S33.4 37.4 24 37.4c-2.1 0-4.1-.3-6-.9L9.6 40.5l2.4-6.9C8.9 31.1 7 27.4 7 23.2 7 15.3 14.6 9 24 9Z" fill="none" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>'
    + '<circle cx="16.6" cy="23.4" r="2.3"/><circle cx="24" cy="23.4" r="2.3"/><circle cx="31.4" cy="23.4" r="2.3"/></svg>');
  const markup = `<span class="cx-chat-mark" aria-hidden="true" style="--cx-chat-mark:url('${BUBBLE}')"></span>`;
  const apply = () => {
    const launcher = document.querySelector('#cx-open');
    if (launcher && !launcher.querySelector('.cx-chat-mark')) launcher.innerHTML = markup;
    document.querySelectorAll('.cx-message-avatar').forEach((a) => { if (!a.querySelector('.cx-chat-mark')) a.innerHTML = markup; });
  };
  apply();
  if (root) new MutationObserver(apply).observe(root, { childList: true, subtree: true });
})();

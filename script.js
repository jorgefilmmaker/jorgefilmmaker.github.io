// Load a YouTube player only after an explicit request; keep one active at a time.
let activeVideo = null;
function restoreVideo(moveFocus = false) {
  if (!activeVideo) return;
  const { frame, cover } = activeVideo;
  frame.replaceChildren(cover);
  activeVideo = null;
  if (moveFocus) cover.focus();
}
document.addEventListener('click', (event) => {
  const shortcut = event.target.closest('a[data-play-target]');
  if (shortcut && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    const frame = document.getElementById(shortcut.dataset.playTarget);
    const target = frame?.querySelector('a.video-cover[data-video]');
    if (target || frame?.querySelector('iframe')) {
      event.preventDefault();
      frame.scrollIntoView({block:'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      if (target) target.click();
      else frame.querySelector('button, iframe')?.focus();
      return;
    }
  }

  const cover = event.target.closest('a.video-cover[data-video]');
  if (!cover || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const videoId = cover.dataset.video;
  if (!/^[\w-]{11}$/.test(videoId)) return;
  event.preventDefault();
  restoreVideo();
  const frame = cover.parentElement;
  const player = document.createElement('iframe');
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
  player.title = cover.getAttribute('aria-label').replace(/^Play /, '');
  player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.allowFullscreen = true;
  const close = document.createElement('button');
  close.className = 'close-player';
  close.type = 'button';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close video');
  close.addEventListener('click', () => restoreVideo(true));
  frame.replaceChildren(player, close);
  activeVideo = { frame, cover };
  close.focus();
});

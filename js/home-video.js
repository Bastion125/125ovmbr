// Autoplay-first logic for homepage video (with optional custom button fallback)
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const videos = document.querySelectorAll('.v-wrap video');
        if (!videos.length) return;

        function resolveSrc(videoEl) {
            if (videoEl.getAttribute('src')) return;
            const dataSrc = videoEl.getAttribute('data-src');
            if (dataSrc) videoEl.setAttribute('src', dataSrc);
        }

        function tryAutoplay(videoEl, playButtonEl) {
            // Most browsers require muted for autoplay
            videoEl.muted = true;
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.playsInline = true;

            const p = videoEl.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => {
                    // Autoplay blocked: show button fallback if present
                    if (playButtonEl) playButtonEl.style.display = '';
                });
            }
        }

        videos.forEach((video) => {
            resolveSrc(video);

            const wrap = video.closest('.v-wrap');
            const playButton = wrap ? wrap.querySelector('.v-play') : null;

            if (playButton) {
                playButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    video.play().catch(console.error);
                });

                video.addEventListener('play', () => {
                    playButton.style.display = 'none';
                });
            }

            tryAutoplay(video, playButton);
        });
    });
})();


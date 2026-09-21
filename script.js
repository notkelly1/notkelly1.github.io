(function () {
    const root = document.documentElement;

    //the site used to default to dark mode; bump this once so anyone with an old saved
    //preference (from before light became the default) gets reset to light a single time
    const THEME_DEFAULT_VERSION = '2';
    if (localStorage.getItem('themeDefaultVersion') !== THEME_DEFAULT_VERSION) {
        localStorage.removeItem('theme');
        localStorage.setItem('themeDefaultVersion', THEME_DEFAULT_VERSION);
    }

    const savedTheme = localStorage.getItem('theme');
    //defaults to light mode unless the user has explicitly picked a theme since
    const initialTheme = savedTheme || 'light';
    root.setAttribute('data-theme', initialTheme);

    document.addEventListener('DOMContentLoaded', () => {
        //theme toggle function
        const toggle = document.querySelector('.theme-toggle');

        if (toggle) {
            const applyTheme = (theme) => {
                root.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);

                toggle.setAttribute(
                    'aria-label',
                    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                );
            };
            applyTheme(root.getAttribute('data-theme') || initialTheme);

            toggle.addEventListener('click', () => {
                const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
            });
        } //closes the if statement for the theme toggle function
        
        //hamburger menu function (for mobile devices)
        const menuToggle = document.querySelector('.menu-toggle');
        const navbar = document.querySelector('.navbar');

        if (menuToggle && navbar) {
            menuToggle.addEventListener('click', () => {
                navbar.classList.toggle('active');
                const isActive = navbar.classList.contains('active');

                menuToggle.setAttribute('aria-label', isActive ? 'Close menu' : 'Open menu');
                menuToggle.innerHTML = isActive
                    ? "<i class='bx bx-x'></i>"
                    : "<i class='bx bx-menu'></i>";
            });
        } //closes the if statement for the hamburger menu function

        //Contents box hide/show toggle (index.html article page)
        const tocToggle = document.getElementById('toc-toggle');
        const tocList = document.getElementById('toc-list');

        if (tocToggle && tocList) {
            tocToggle.addEventListener('click', () => {
                const isHidden = tocList.hidden;
                tocList.hidden = !isHidden;
                tocToggle.textContent = isHidden ? 'hide' : 'show';
            });
        } //closes the if statement for the contents box toggle

        //photo viewer (lightbox) for the photography page grids and the article's photo galleries;
        //without JavaScript the thumbnails still link straight to the full-size image
        const galleries = document.querySelectorAll('.photo-grid, .wiki-gallery');

        if (galleries.length) {
            const box = document.createElement('div');
            box.className = 'lightbox';
            box.hidden = true;
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-modal', 'true');
            box.setAttribute('aria-label', 'Photo viewer');
            box.innerHTML =
                "<button type='button' class='lightbox-close' aria-label='Close'>&times;</button>" +
                "<button type='button' class='lightbox-prev' aria-label='Previous photo'>&#8249;</button>" +
                "<img alt=''>" +
                "<button type='button' class='lightbox-next' aria-label='Next photo'>&#8250;</button>" +
                "<p class='lightbox-caption'></p>";
            document.body.appendChild(box);

            const boxImg = box.querySelector('img');
            const boxCaption = box.querySelector('.lightbox-caption');
            const closeBtn = box.querySelector('.lightbox-close');
            const prevBtn = box.querySelector('.lightbox-prev');
            const nextBtn = box.querySelector('.lightbox-next');
            let links = []; //photo links in the gallery that was opened
            let current = 0;
            let opener = null; //link to return keyboard focus to when the viewer closes

            const show = (index) => {
                current = (index + links.length) % links.length;
                const link = links[current];
                const thumb = link.querySelector('img');
                const figcaption = link.parentElement.querySelector('figcaption');
                boxImg.src = link.getAttribute('href');
                boxImg.alt = thumb ? thumb.alt : '';
                boxCaption.textContent = figcaption ? figcaption.textContent : (thumb ? thumb.alt : '');
            };

            const closeBox = () => {
                box.hidden = true;
                boxImg.removeAttribute('src');
                if (opener) opener.focus();
            };

            galleries.forEach((gallery) => {
                gallery.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link || !gallery.contains(link)) return;
                    e.preventDefault();
                    links = Array.from(gallery.querySelectorAll('a'));
                    opener = link;
                    prevBtn.hidden = nextBtn.hidden = links.length < 2;
                    show(links.indexOf(link));
                    box.hidden = false;
                    closeBtn.focus();
                });
            });

            closeBtn.addEventListener('click', closeBox);
            prevBtn.addEventListener('click', () => show(current - 1));
            nextBtn.addEventListener('click', () => show(current + 1));
            //clicking the dark background (but not the photo or buttons) closes the viewer
            box.addEventListener('click', (e) => {
                if (e.target === box) closeBox();
            });

            document.addEventListener('keydown', (e) => {
                if (box.hidden) return;
                if (e.key === 'Escape') closeBox();
                else if (e.key === 'ArrowLeft' && links.length > 1) show(current - 1);
                else if (e.key === 'ArrowRight' && links.length > 1) show(current + 1);
                else if (e.key === 'Tab') {
                    //keep keyboard focus inside the viewer while it is open
                    const focusable = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            });
        } //closes the if statement for the photo viewer
    }); //closes the DOMContentLoaded event listener
})(); //closes the IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope

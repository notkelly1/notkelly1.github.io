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
    }); //closes the DOMContentLoaded event listener
})(); //closes the IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope

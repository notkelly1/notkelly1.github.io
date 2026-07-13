(function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    //const initialTheme = savedTheme || 'dark';
    //use built in browser API (windows.matchMedia) to detect the user's preferred color scheme and set the initial theme accordingly
    const getSystemTheme = () => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if(!localStorage.getItem('theme')) {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    };

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
        }
        
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
        }
    });
})();

(function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'dark';

    root.setAttribute('data-theme', initialTheme);

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.querySelector('.theme-toggle');
        const icon = document.querySelector('.theme-toggle-icon');

        if (!toggle) return;

        const applyTheme = (theme) => {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
                toggle.setAttribute(
                    'aria-label',
                    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                );
            }
        };

        applyTheme(root.getAttribute('data-theme') || initialTheme);

        toggle.addEventListener('click', () => {
            const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    });
})();

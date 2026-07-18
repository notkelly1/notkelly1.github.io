(function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    //const initialTheme = savedTheme || 'dark';
    //use built in browser API (windows.matchMedia) to detect the user's preferred color scheme and set the initial theme accordingly
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    //checks local storage for a saved theme, if none is found, it uses the system theme determined previously
    const initialTheme = savedTheme || getSystemTheme();
    root.setAttribute('data-theme', initialTheme);

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.carousel').forEach((carousel) => {
            //carousel function
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            //the constants below don't use document.querySelector due to scope, since document.querySelector will return the first match it finds anywhere (so document.querySelector would control the first carousel on the page, not the one that the user is interacting with). carousel.querySelector would search only inside the specific carousel element.
            const nextButton = carousel.querySelector('.carousel-next');
            const prevButton = carousel.querySelector('.carousel-prev');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            let index = 0;
            //loop through the slides: each time the loop runs, it creates a dot for each slide and each dot gets a click listener that calles goTo(that index), which is created fresh each loop iteration.
            slides.forEach((slide, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goTo(i)); //eventListener used to make the dots clickable, adding a functionality on top of the prev/next arrows.
                dotsContainer.appendChild(dot);
            });
            const dots = Array.from(dotsContainer.children);

            //update function is visually applying the changes to index and sliding the track to show the correct slide (translateX), highlighting the correct dot.
            function update(){
                track.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            }
            
            //goTo function is using the modulo operator to ensure the index wraps around correctly.
            function goTo(i) {
                index = (i + slides.length) % slides.length; //this line ensures that the index wraps a number into a fixed range from 0 to slides.length -1.
                update();
            }
            nextButton.addEventListener('click', () => goTo(index + 1));
            prevButton.addEventListener('click', () => goTo(index - 1));

            update();
        }); //closes the forEach loop for the carousel function

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
    }); //closes the DOMContentLoaded event listener
})(); //closes the IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope

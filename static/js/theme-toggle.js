document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleFloat = document.getElementById('theme-toggle-float');
    const lightModeBtn = document.getElementById('light-mode');
    const darkModeBtn = document.getElementById('dark-mode');
    const html = document.documentElement;
    
    // Check stored theme or system preference
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply initial theme
    setTheme(currentTheme);

    // Toggle theme on navbar button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // Toggle theme on floating button click
    if (themeToggleFloat) {
        themeToggleFloat.addEventListener('click', function() {
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // Set light mode from dropdown
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setTheme('light');
        });
    }

    // Set dark mode from dropdown
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setTheme('dark');
        });
    }

    function setTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update all theme toggle icons
        updateThemeIcons(theme);

        // Update navbar classes
        const navbar = document.querySelector('.navbar');

        if (theme === 'dark') {
            navbar?.classList.remove('navbar-light', 'bg-light');
            navbar?.classList.add('navbar-dark', 'bg-dark');
        } else {
            navbar?.classList.remove('navbar-dark', 'bg-dark');
            navbar?.classList.add('navbar-light', 'bg-light');
        }
        
        // The footer is now controlled by CSS using the data-bs-theme attribute
    }
    
    function updateThemeIcons(theme) {
        // Update navbar theme toggle icon
        if (themeToggle) {
            const navIcon = themeToggle.querySelector('i');
            if (navIcon) {
                navIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update floating theme toggle icon
        if (themeToggleFloat) {
            const floatIcon = themeToggleFloat.querySelector('i');
            if (floatIcon) {
                floatIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Update theme dropdown icon
        const themeDropdownIcon = document.querySelector('#themeDropdown i');
        if (themeDropdownIcon) {
            themeDropdownIcon.className = theme === 'dark' ? 'fas fa-sun me-1' : 'fas fa-moon me-1';
        }
    }
});
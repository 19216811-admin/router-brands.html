document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips and popovers
    const tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .map(el => new bootstrap.Tooltip(el));

    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        .map(el => new bootstrap.Popover(el));

    // Back to top functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.onscroll = () => {
            backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        };
        backToTopBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    }
});
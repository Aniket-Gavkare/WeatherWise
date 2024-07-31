const weatherCards = document.querySelectorAll('.weather-card');
        
weatherCards.forEach(card => {
    card.addEventListener('click', () => {
        weatherCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});
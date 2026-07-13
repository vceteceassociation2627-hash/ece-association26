function changeReadMore() {
    const mycontent =
        document.getElementById('mybox1id');
    const mybutton =
        document.getElementById('mybuttonid');
    const span1 = document.getElementById("span1")

    if (mycontent.style.display === 'none'
        || mycontent.style.display === '') {
        mycontent.style.display = 'inline';
        span1.style.display = "none";
        mybutton.textContent = 'Read Less';
    } else {
        mycontent.style.display = 'none';
        mybutton.textContent = 'Read More';
        span1.style.display = "inline";
    }
}
function createConfetti() {
                const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
                
                for (let i = 0; i < 150; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.top = -10 + 'px';
                    confetti.style.width = Math.random() * 10 + 5 + 'px';
                    confetti.style.height = confetti.style.width;
                    confetti.style.animationDelay = Math.random() * 5 + 's';
                    document.body.appendChild(confetti);
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, 3000);
                }
            }
        
    
window.onload = function() {
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
    createConfetti();
}

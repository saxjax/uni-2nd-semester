


console.log(window.location.href);

 function showImages () {
    console.log("We're in");

    // Rapport
    if (window.location.href === 'http://localhost:3000/rapport'){
        document.getElementById("design-rapport").addEventListener("click", () => {
            document.getElementById('design-rapportPage').src = 'img/Design/4-rapport.jpg';
        });
    } else if (window.location.href === 'http://localhost:3000/'){
        // Home
        document.getElementById("design-home").addEventListener("click", () => {
            document.getElementById('design-homePage').src = 'img/Design/3-home.jpg';
        });
    } else if (window.location.href === 'http://localhost:3000/evalueringer'){
        // Evalueringer
        document.getElementById("design-evalueringer").addEventListener("click", () => {
            document.getElementById('design-evalueringerPage').src = 'img/Design/6-evalueringer.jpg';
        });
    }
}

showImages();


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





function toggleDrawer() {
    var drawer = document.querySelector('.drawer');
    if (drawer.style.left === '0px') {
        drawer.style.left = '-250px';
    } else {
        drawer.style.left = '0px';
    }
}


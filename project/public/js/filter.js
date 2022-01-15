let button = document.getElementById('filter');

let navigation = document.getElementById('filter-menu');

let wrp = document.getElementById('filter-wrp');

button.addEventListener('click', function () {
    navigation.classList.toggle('catalog_filter__nav--show');
    wrp.classList.toggle('catalog_grid__wrp--show');
});
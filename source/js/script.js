function initMap() {
  var sedona = {lat: 34.8812803, lng: -111.8009852};
  var map = new google.maps.Map(document.querySelector('.map__api'), {
    center: {lat: 34.75, lng: -111.8009852},
    zoom: 7,
    disableDefaultUI: true
  });
  var customMarker = '../img/sprite/icon-map-marker.svg';
  var marker = new google.maps.Marker({
    position: sedona,
    map: map,
    title: 'Sedona',
    icon: customMarker
  });
}

var menu = document.querySelector('.nav__list');
var menuButton = document.querySelector('.header__icon-menu');


menu.classList.add('nav__list--hide');
menu.classList.remove('nav__list--hide');

menuButton.addEventListener('click', function () {
  menu.classList.toggle('nav__list--hide');
});

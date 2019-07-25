'use strict';

var MAP_HEIGHT = 630;
var MAP_PADDING_TOP = 130;
var OFFER_PIN_WIDTH = 50;
var OFFER_PIN_HEIGHT = 70;
var MAP_PIN_WIDTH = 65;
var MAP_PIN_HEIGHT = 87;

var mapWidth = document.querySelector('main').offsetWidth;

var createOffer = function (num) {
  var OFFER_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var offer = {};

  offer.author = {avatar: 'img/avatars/user0' + num + '.png'};
  offer.offer = {type: OFFER_TYPES[Math.round(Math.random() * 3)]};
  offer.location = {
    x: Math.round(Math.random() * mapWidth),
    y: Math.round(Math.random() * (MAP_HEIGHT - MAP_PADDING_TOP) + MAP_PADDING_TOP)
  };

  return offer;
};

var createPin = function (offer) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pin = pinTemplate.cloneNode(true);
  var img = pin.querySelector('img');

  pin.style.left = (offer.location.x - OFFER_PIN_WIDTH / 2) + 'px';
  pin.style.top = (offer.location.y - OFFER_PIN_HEIGHT) + 'px';
  img.src = offer.author.avatar;
  img.alt = 'заголовок объявления';

  return pin;
};

var createOfferList = function (num) {
  var offersList = [];
  for (var i = 1; i <= num; i++) {
    offersList.push(createOffer(i));
  }

  return offersList;
};

var renderPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(createPin(offers[i]));
  }

  return fragment;
};

var enebleForm = function (formEnabled) {
  var fildsets = document.querySelectorAll('fieldset');
  var selects = document.querySelectorAll('select');

  for (var i = 0; i < fildsets.length; i++) {
    fildsets[i].disabled = !formEnabled;
  }

  for (i = 0; i < selects.length; i++) {
    selects[i].disabled = !formEnabled;
  }

  if (formEnabled) {
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');

    document.querySelector('.map__pins').appendChild(renderPins(offers));
  }
};

var getMapPinCoordinates = function (mapPin) {
  var coordinates = {};
  coordinates.x = parseInt(mapPin.style.left, 10) + Math.round(MAP_PIN_WIDTH / 2);
  coordinates.y = parseInt(mapPin.style.top, 10) + MAP_PIN_HEIGHT;

  return coordinates;
};

var writeInputValue = function (input, value) {
  if (input === address) {
    var mapPinCoordinates = getMapPinCoordinates(value);

    input.value = mapPinCoordinates.x + ', ' + mapPinCoordinates.y;
  }
};

var syncTypeAndPrice = function () {
  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  switch (typeOfHousing.value) {
    case 'bungalo':
      price.min = BUNGALO_MIN_PRICE;
      price.placeholder = BUNGALO_MIN_PRICE;
      break;
    case 'flat':
      price.min = FLAT_MIN_PRICE;
      price.placeholder = FLAT_MIN_PRICE;
      break;
    case 'house':
      price.min = HOUSE_MIN_PRICE;
      price.placeholder = HOUSE_MIN_PRICE;
      break;
    case 'palace':
      price.min = PALACE_MIN_PRICE;
      price.placeholder = PALACE_MIN_PRICE;
      break;
  }
};

var syncTimeinAndTimeout = function () {
  timeout.selectedIndex = timein.selectedIndex;
};

var syncTimeoutAndTimein = function () {
  timein.selectedIndex = timeout.selectedIndex;
};

var offers = createOfferList(8);
var mapPin = document.querySelector('.map__pin--main');
var address = document.querySelector('input[name=address]');
var typeOfHousing = document.querySelector('select[name=type]');
var price = document.querySelector('input[name=price');
var timein = document.querySelector('select[name=timein]');
var timeout = document.querySelector('select[name=timeout]');


enebleForm(false);

writeInputValue(address, mapPin);

typeOfHousing.addEventListener('change', function () {
  syncTypeAndPrice();
});

timein.addEventListener('change', function () {
  syncTimeinAndTimeout();
});

timeout.addEventListener('change', function () {
  syncTimeoutAndTimein();
});

// перемещение mapPin
var isFormEnabled = false;

var isPinCoordXOnMap = function (pin) {
  var pinCoordX = pin.offsetLeft + Math.round(MAP_PIN_WIDTH / 2);
  var result = true;

  if (pinCoordX < 0) {
    pin.style.left = 0 - Math.round(MAP_PIN_WIDTH / 2) + 'px';
    result = false;
  }

  if (pinCoordX > mapWidth) {
    pin.style.left = mapWidth - Math.round(MAP_PIN_WIDTH / 2) + 'px';
    result = false;
  }

  return result;
};

var isPinCoordYOnMap = function (pin) {
  var pinCoordY = pin.offsetTop + MAP_PIN_HEIGHT;
  var result = true;

  if (pinCoordY < MAP_PADDING_TOP) {
    pin.style.top = MAP_PADDING_TOP - MAP_PIN_HEIGHT + 'px';
    result = false;
  }

  if (pinCoordY > MAP_HEIGHT) {
    pin.style.top = MAP_HEIGHT - MAP_PIN_HEIGHT + 'px';
    result = false;
  }

  return result;
};

mapPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  if (!isFormEnabled) {
    enebleForm(true);
  }

  var startPinCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startPinCoords.x - moveEvt.clientX,
      y: startPinCoords.y - moveEvt.clientY,
    };

    mapPin.style.left = mapPin.offsetLeft - shift.x + 'px';
    mapPin.style.top = mapPin.offsetTop - shift.y + 'px';

    if (isPinCoordXOnMap(mapPin)) {
      startPinCoords.x = moveEvt.clientX;
    }

    if (isPinCoordYOnMap(mapPin)) {
      startPinCoords.y = moveEvt.clientY;
    }

    writeInputValue(address, mapPin);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    writeInputValue(address, mapPin);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
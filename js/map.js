'use strict';

(function () {
  var getMapPinCoordinates = function (mapPin) {
    var coordinates = {};
    coordinates.x = parseInt(mapPin.style.left, 10) + Math.round(window.data.MAP_PIN_WIDTH / 2);
    coordinates.y = parseInt(mapPin.style.top, 10) + window.data.MAP_PIN_HEIGHT;

    return coordinates;
  };

  var writeInputValue = function (input, value) {
    if (input === address) {
      var mapPinCoordinates = getMapPinCoordinates(value);

      input.value = mapPinCoordinates.x + ', ' + mapPinCoordinates.y;
    }
  };

  var mapPin = document.querySelector('.map__pin--main');
  var address = document.querySelector('input[name=address]');

  window.form.enebleForm(false);

  writeInputValue(address, mapPin);

  // перемещение mapPin

  var isFormEnabled = false;

  var isPinCoordXOnMap = function (pin) {
    var pinCoordX = pin.offsetLeft + Math.round(window.data.MAP_PIN_WIDTH / 2);
    var result = true;

    if (pinCoordX < 0) {
      pin.style.left = 0 - Math.round(window.data.MAP_PIN_WIDTH / 2) + 'px';
      result = false;
    }

    if (pinCoordX > window.data.mapWidth) {
      pin.style.left = window.data.mapWidth - Math.round(window.data.MAP_PIN_WIDTH / 2) + 'px';
      result = false;
    }

    return result;
  };

  var isPinCoordYOnMap = function (pin) {
    var pinCoordY = pin.offsetTop + window.data.MAP_PIN_HEIGHT;
    var result = true;

    if (pinCoordY < window.data.MAP_PADDING_TOP) {
      pin.style.top = window.data.MAP_PADDING_TOP - window.data.MAP_PIN_HEIGHT + 'px';
      result = false;
    }

    if (pinCoordY > window.data.MAP_HEIGHT) {
      pin.style.top = window.data.MAP_HEIGHT - window.data.MAP_PIN_HEIGHT + 'px';
      result = false;
    }

    return result;
  };

  mapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (!isFormEnabled) {
      window.form.enebleForm(true);
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
})();
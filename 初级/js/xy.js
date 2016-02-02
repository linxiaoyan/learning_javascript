/**
 * Created by davelin on 2016/1/24.
 */

function $(v) {
  if (typeof  v === 'function') {
    window.onload = v;
  } else if (typeof v === 'string') {
    return document.getElementById(v);
  } else if (typeof v == 'object') {
    return v;
  }
}

function getStyle(obj, attr) {
  return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

function setStyle(obj, attr, value) {
  obj.style[attr] = value + 'px';
}

function move(obj, attr, inc, target, endFn) {
  inc = parseInt(getStyle(obj, attr)) > target ? -inc : inc;
  clearInterval(obj.move);

  obj.move = setInterval(function () {
    var offset = parseInt(getStyle(obj, attr)) + inc;

    if (offset > target && inc > 0 || offset < target && inc < 0) {
      offset = target;
    }

    setStyle(obj, attr, offset);
    if (offset == target) {
      clearInterval(obj.move);

      endFn && endFn();
    }
  }, 30);
}

function shake(obj, attr, endFn) {
  if (obj.shake) {
    return;
  }

  var offset = parseInt(getStyle(obj, attr));
  var arr = [];
  var num = 0;

  for (var i = 20; i > 0; i -= 2) {
    arr.push(i, -i);
  }
  arr.push(0);

  clearInterval(obj.shake);
  obj.shake = setInterval(function () {
    setStyle(obj, attr, offset + arr[num++]);

    if (num == arr.length) {
      clearInterval(obj.shake);
      obj.shake = null;
      endFn && endFn();
    }
  }, 50);
}
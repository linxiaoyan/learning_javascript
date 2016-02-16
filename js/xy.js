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

function move(obj, attr, inc, target, endFn) {
  inc = parseInt(getStyle(obj, attr)) > target ? -inc : inc;
  clearInterval(obj.move);

  obj.move = setInterval(function () {
    var offset = parseInt(getStyle(obj, attr)) + inc;

    if (offset > target && inc > 0 || offset < target && inc < 0) {
      offset = target;
    }

    obj.style[attr] = offset + 'px';
    if (offset == target) {
      clearInterval(obj.move);

      endFn && endFn();
    }
  }, 30);
}

function shake(obj, attr, endFn) {
  if (obj.shaked) {
    return;
  }

  obj.shaked = false;
  var offset = parseInt(getStyle(obj, attr));
  var arr = [];
  var num = 0;

  for (var i = 20; i > 0; i -= 2) {
    arr.push(i, -i);
  }
  arr.push(0);

  clearInterval(obj.shake);
  obj.shake = setInterval(function () {
    obj.style[attr] = (offset + arr[num++]) + 'px';

    if (num == arr.length) {
      clearInterval(obj.shake);
      obj.shaked = false;
      endFn && endFn();
    }
  }, 30);
}

function opacity(obj, num, target, frequency, endFn) {
  num = getStyle(obj, 'opacity') * 100 < target ? num : -num;
  clearInterval(obj.opacity);

  obj.opacity = setInterval(function () {
    var speed = parseInt(getStyle(obj, 'opacity') * 100) + num;

    if (speed > target && num > 0 || speed < target && num < 0) {
      speed = target;
    }

    obj.style.opacity = speed / 100;
    obj.style.filter = 'alpha(opacity=' + speed + ')';

    if (speed == target) {
      clearInterval( obj.opacity );
      endFn && endFn();
    }
  }, frequency);
}

function toTwo(num) {
  return num >= 10 ? ('' + num) : ('0' + num);
}

function getDate() {
  var oDate = new Date();
  var iYear = oDate.getFullYear();
  var iMon = oDate.getMonth() + 1;
  var iDay = oDate.getDay();
  var iWeek = iDay - 1;
  var iHours = oDate.getHours();
  var iMin = oDate.getMinutes();
  var iSec = oDate.getSeconds();
  var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  var str = iYear + '年' + iMon + '月' + iDay + '日' + ' ' + week[iWeek] + ' ' +
            toTwo(iHours) + ':' + toTwo(iMin) + ':' + toTwo(iSec);
  return str;
}

function getPos(obj) {
  var pos = {top:0, left:0};

  while (obj) {
    pos.top += obj.offsetTop;
    pos.left += obj.offsetLeft;
    obj = obj.offsetParent;
  }

  return pos;
}

function getElementsByClassName(obj, tagName, className) {
  var aClassName = className.split(', ');
  var elements = obj.getElementsByTagName(tagName);
  var resElements = [];

  for (var i = 0; i < aClassName.length; i++) {
    for (var j = 0; j < elements.length; j++) {
      var arrClassName = elements[j].className.split(' ');

      if (-1 != arrIndexOf(arrClassName, aClassName[i])) {
        resElements.push(elements[j]);
      }
    }
  }

  return resElements;
}

function addClass(obj, className) {
  if (obj.className == '') {
    obj.className = className;
  } else {
    var aClassName = obj.className.split(' ');

    if (-1 == arrIndexOf(aClassName, className)) {
      obj.className += ' ' + className;
    }
  }
}

function arrIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      return i;
    }
  }
  return -1;
}

function removeClass(obj, className) {
  if (obj.className != '') {
    var aClassName = obj.className.split(' ');
    var n = arrIndexOf(aClassName, className);

    if (-1 != n) {
      aClassName.splice(n, 1);
      obj.className = aClassName.join(' ');
    }
  }
}

function getChecked(form, name) {
  var arr = [];

  for (var i = 0; i < form[name].length; i++) {
    if (form[name][i].checked) {
      arr.push(form[name][i].value);
    }
  }

  if (form[name][0].type == 'radio') {
    return arr[0];
  } else if (form[name][0].type == 'checkbox') {
    return arr;
  }
}

















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

//移动
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

//震动
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

//透明度渐变
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

//获取当前日期
function getDate() {
  var oDate = new Date();
  var iYear = oDate.getFullYear();
  var iMon = oDate.getMonth() + 1;
  var iDay = oDate.getDate();
  var iWeek = oDate.getDay() - 1;
  var iHours = oDate.getHours();
  var iMin = oDate.getMinutes();
  var iSec = oDate.getSeconds();
  var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  var str = iYear + '年' + iMon + '月' + iDay + '日' + ' ' + week[iWeek] + ' ' +
            toTwo(iHours) + ':' + toTwo(iMin) + ':' + toTwo(iSec);
  return str;
}

//获取当前位置
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

//添加class样式
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

//移除class样式
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

//获取表单选中项
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

//事件绑定
function bind(obj, evname, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evname, fn, false);
  } else {
    obj.attachEvent('on' + evname, function() {
      fn.call(obj);
    });
  }
}

//拖拽
function drag(obj) {
  obj.onmousedown = function(ev) {
    var ev = ev || event;

    var disX = ev.clientX - this.offsetLeft;
    var disY = ev.clientY - this.offsetTop;

    //setCapture 全局捕获，为兼容ie
    if (obj.setCapture) {
      obj.setCapture();
    }

    document.onmousemove = function(ev) {
      var ev = ev || event;
      var l = ev.clientX - disX;
      var t = ev.clientY - disY;

      if (l < 0) {
        l = 0;
      } else if (l > document.documentElement.clientWidth - obj.offsetWidth) {
        l = document.documentElement.clientWidth - obj.offsetWidth;
      }

      if (t < 0) {
        t = 0;
      } else if (t > document.documentElement.clientHeight - obj.offsetHeight) {
        t = document.documentElement.clientHeight - obj.offsetHeight;
      }

      obj.style.left = l + 'px';
      obj.style.top = t + 'px';
    };

    document.onmouseup = function() {
      document.onmousemove = document.onmouseup = null;

      if (obj.releaseCapture) {
        obj.releaseCapture();
      }
    };

    //当其他对象被选中时，阻止浏览器默认的拖拽动作
    return false;
  };
}















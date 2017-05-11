var res = "";
var previous = "";
var opening = 0;
var closing = 0;
var numeric = false;
var decimal = false;
var display = $(".display");

$(".btn").click(getBtn);

function getBtn() {
  $('.notify').css("visibility", "hidden");
  var val = $(this).html();
  switch (val) {
    case 'CE':
      init();
      print('0');
      break;
    case '=':
      getRes();
      break;
    case '←':
      res = res.trim();
      var len = res.length;
      if (res[len - 1] == '(') {
        opening--;
      } else if (res[len - 1] == ')') {
        closing--;
      }

      if (len > 1) {
        res = res.slice(0, -1);
        print(res);
      } else {
        res = '';
        print('0');
      }
      break;

    default:
      treat(val);
      break;
  }
}

function init() {
  res = "";
  opening = 0;
  closing = 0;
  numeric = false;
  decimal = false;
}

function treat(val) {
  switch (val) {
    case '+':
    case '-':
    case 'x':
    case '÷':
    case '%':
      if (!numeric) {
        return 0;
      }
      decimal = false;
      numeric = false;
      break;

    case '.':
      if (decimal || !numeric) {
        return 0;
      } else {
        decimal = true;
        numeric = false;
        break;
      }

    case '(':
      if (numeric || previous == '.') {
        return 0;
      } else {
        val = '(';
        opening++;
      }
      numeric = false;
      break;

    case ')':
      if (!numeric) {
        return 0;
      }
      if (opening == closing) {
        return 0;
      } else {
        val = ')';
        closing++;
      }
      numeric = true;
      break;

    default:
      if (previous == ')') {
        return 0;
      }
      numeric = true;
      break;
  }
  previous = val;
  if (res.length < 45) {
    res = res.concat(val);
    print(res);
  } else {
    $('.notify').css("visibility", "visible");
    return 0;
  }
  return 1;
}

function getRes() {
  var final = res.trim();
  var len = final.length;
  while (final.slice(-1) == '(') {
    final = final.slice(0, -1);
    opening--;
  }
  if (!numeric) {
    final = final.trim().slice(0, -1);
  }
  while (closing < opening) {
    final = final.concat(')');
    closing++;
  }
  final = final.replace(/x/g, '*');
  final = final.replace(/÷/g, '/');
  final = eval(final);
  if (!Number.isInteger(final)) {
    final = final.toFixed(2);
  }
  print(final);
  init();
  return 1;
}

function print(exp) {
  var length = exp.length;
  if (length > 5 && length < 16) {
    var newSize = (13 * (6 / length)) + "vh";
    display.css("font-size", newSize);
  } else if (length < 5) {
    display.css("font-size", "13vh");
  }
  display.html(exp);
}

const dateNow = () => {
  let currentdate = new Date();
  let min = currentdate.getMinutes();
  let sec = currentdate.getSeconds();
  let a = '';
  let b = '';
  if (min < 10) {
    a = '0' + min;
  }
  else {
    a = min;
  }
  if (sec < 10) {
    b = '0' + sec;
  }
  else {
    b = sec;
  }
  let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + a + ":"
    + b;
  return datetime;
};

let currentdate = new Date();
let day = new Date(Date.UTC(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate(), currentdate.getHours(), currentdate.getSeconds(), currentdate.getSeconds()));
console.log(day);
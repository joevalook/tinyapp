function generateRandomString() {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  result = '';
  for (let i = 0; i < 6; i++) {
    result += char[Math.floor(Math.random() * char.length)]; //chooses a random character from char and appends it to result
  }
  return result;
}

function findEmail(users, email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user]; //returns user object if found
    }
  } 
}

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

const makeProperUrl = url => {
    if (url.slice(0, 4) === 'http') {
    } else if (url.slice(0, 3) === 'www') {
      url = "https://" + url
    } else {
      url = "https://www." + url;
    } 
    return url
}

const uniqVisits = timeStamps => {
  let a = 0
  let b = []
  for (let arr of timeStamps) {
    if (b.indexOf(arr[1]) === -1) {
      b.push(arr[1])
    }
  } return b.length
}
module.exports = {generateRandomString, findEmail, dateNow, makeProperUrl, uniqVisits}
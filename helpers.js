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

module.exports = {generateRandomString, findEmail}
function generateRandomString() {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  result = '';
  for (let i = 0; i < 6; i++) {
    result += char[Math.floor(Math.random() * char.length)];
  }
  return result;
}

function findEmail(users, email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  } 
}

module.exports = {generateRandomString, findEmail}
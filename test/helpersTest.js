const { assert } = require('chai');

const { findEmail, generateRandomString } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email if that user\'s is in the database', function() {
    const user = findEmail(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return a false if that user\'s email is not in the database', function() {
    const user = findEmail(testUsers, "user@edasfadsxample.com")
    assert.equal(user, undefined);
  });
});
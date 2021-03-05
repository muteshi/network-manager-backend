// Function to test for password complexity rules
function validPassword(str) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(str);
}

module.exports = {
  validPassword,
};

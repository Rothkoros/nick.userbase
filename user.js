class User {
  constructor(id, firstName, lastName, email, birthDate, password) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthDate = birthDate;
    this.password = password;
  }
}

module.exports = User;

const bcrypt = require('bcrypt');

class Person {
    constructor(username, user, password) {
        this.username = username;
        this.user = user;
        this.password = password;
    }

    async encryptPassword() {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
    }

    isValid() {
        if (!this.username || !this.user || !this.password) {
            return { valid: false, message: 'Faltan datos: Se requiere username, user y password' };
        }

        if (this.password.length < 6) {
            return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        return { valid: true };
    }
}

module.exports = Person;

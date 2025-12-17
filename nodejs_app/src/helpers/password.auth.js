const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    const salt =bcrypt.genSaltSync(saltRounds)
    return bcrypt.hash(password,salt)
    
}

async function comparePassword(inputPassword,hashedPassword) {
    return bcrypt.compare(inputPassword,hashedPassword)
    
}

module.exports ={
    hashPassword,
    comparePassword
}
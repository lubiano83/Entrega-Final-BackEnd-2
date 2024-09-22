import bcrypt from "bcrypt";

// Función para crear un hash a partir de una contraseña
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar una contraseña comparándola con un hash
const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export { createHash, isValidPassword };
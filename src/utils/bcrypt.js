import bcrypt from "bcrypt";
// Bcrypt es una libreria de hashing de contraseñas
// instalamos: npm install bcrypt
// Importamos el modulo

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
// hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un salt.
// Un "salt" es un string random que se hace para que el proceso se realice de forma impredecible.
// (10) = generara un salt de 10 caracteres, este proceso es irreversible

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
// Al comprar los password, retorna true o false segun corresponda.

export { createHash, isValidPassword };
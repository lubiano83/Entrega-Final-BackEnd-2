// Función para generar un código único
export const generateUniqueCode = () => {
    const characters = "ABCDFEGHJKLMNOPQRSTUVWXYZabcdefghijklmnrstuvwxyz0123456789";
    const codeLength = 8;
    let code = "";

    // Generar una cadena aleatoria de 8 caracteres
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    // Agregar un timestamp para asegurar la unicidad
    const timestamp = Date.now().toString(36); // Convierte el timestamp a base 36 para que sea más compacto
    return code + "-" + timestamp; // Concatenar el código generado con el timestamp
};

// Función para calcular el total de los productos en el carrito
export const getTotal = (products) => {
    let total = 0;

    // Sumar el precio de cada producto multiplicado por su cantidad
    products.forEach((item) => {
        total += item.price * item.quantity; // Asegurarse de que 'item' tiene 'price' y 'quantity'
    });

    return total;
};
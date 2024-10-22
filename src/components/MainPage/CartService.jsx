// src/services/cartService.js
import axios from 'axios';

// Configurar la URL base de tu API
const API_URL = 'http://localhost:8080/api'; // Cambia esto si es necesario

// Obtener el carrito por el nombre de usuario
export const getCartByUsername = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/cart/view`, { username });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el carrito: ${error.response ? error.response.data : error.message}`);
  }
};

// Agregar un curso al carrito
export const addToCart = async (username, courseID, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      username,
      courseID,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar el curso al carrito: ${error.response ? error.response.data : error.message}`);
  }
};



// Eliminar un curso del carrito
export const removeFromCart = async (username, courseID) => {
  try {
    const response = await axios.post(`${API_URL}/cart/remove`, {
      username,
      courseID,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el curso del carrito: ${error.response ? error.response.data : error.message}`);
  }
};

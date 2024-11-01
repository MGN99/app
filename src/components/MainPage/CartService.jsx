// src/services/cartService.js
import axios from 'axios';



const API_URL = 'http://localhost:8080/graphql'; // Cambia esto si es necesario



// Obtener el carrito por nombre de usuario
export const viewCartByEmail = async (email) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        mutation {
          viewCartByEmail(email: "${email}") {
            cartID
            userID
            courseID
          }
        }
      `,
    });
    return response.data.data.viewCartByEmail; // Ajusta según la estructura de tu respuesta
  } catch (error) {
    throw new Error(`Error al obtener el carrito: ${error.response ? error.response.data : error.message}`);
  }
};


// Obtener el carrito por ID de usuario
export const viewCartByUserID = async (userID) => {
  try {
    const response = await axios.post(`${API_URL}/cart/viewByID`, { userID });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el carrito por ID de usuario: ${error.response ? error.response.data : error.message}`);
  }
};

// Eliminar un curso del carrito
export const removeFromCart = async (courseID) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        mutation {
          deleteCartByCourseID(courseID: "${courseID}")
        }
      `,
    });
    return response.data.data.deleteCartByCourseID; // Maneja la respuesta según sea necesario
  } catch (error) {
    throw new Error(`Error al eliminar el curso del carrito: ${error.response ? error.response.data.errors[0].message : error.message}`);
  }
};


import axios from "axios";

// Configuración de Axios
const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Cambia esto a tu URL de API
  timeout: 40000, // Ajusta el tiempo de espera según tus necesidades
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "XMLHttpRequest",
    credentials: "include",
    mode: "cors",
  },
  withCredentials: false,
});

// Agregar el token de autenticación si existe
if (localStorage.getItem("token")) {
  const token = localStorage.getItem("token");
  axiosIns.defaults.headers.common = { Authorization: `Bearer ${token}` };
}

// Puedes agregar aquí interceptores personalizados si lo necesitas
// Ejemplo:
// axiosIns.interceptors.request.use(
//   (config) => {
//     // lógica antes de la solicitud
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default axiosIns;

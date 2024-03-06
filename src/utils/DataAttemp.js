import { useState, useEffect } from "react";
import axios from "axios";

const DataAttemp = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          email: userData.auth.email,
          senha: userData.auth.senha,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/login`,
          data
        );
        const { token } = response.data;
        localStorage.setItem("token", token);
        setToken(token);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };
    if (userData.email && userData.password) {
      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const reload = () => {
    localStorage.clear();
    return "Dados alterados com sucesso, favor, faça login novamente!";
  };
  return { userData, token, reload };
};

export default DataAttemp;

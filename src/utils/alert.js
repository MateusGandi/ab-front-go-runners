import Swal from "sweetalert2";

const showAlertSuccess = (message) => {
  Swal.fire({
    text: message,
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "custom-confirm-button", // Adicione a classe personalizada aqui
    },
  });
};

export default showAlertSuccess;

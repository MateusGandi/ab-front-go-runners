// formattingFunctions.js
export const phoneMask = (value) => {
  if (!value) return "";

  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};

export const cpfMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validateFirstName = (
  firstName,
  setFirstNameError,
  setFirstNameHelperText
) => {
  if (!firstName) {
    setFirstNameError(true);
    setFirstNameHelperText("Nome não informado!");
  } else {
    setFirstNameError(false);
    setFirstNameHelperText("");
  }
};

export const maskEmail = (email) => {
  if (email) {
    const [username, domain] = email.split("@");
    const maskedUsername = username.charAt(0) + "*".repeat(username.length - 1);
    return maskedUsername + "@" + domain;
  }
  return "";
};
// Add similar functions for other validation logic...

export const getTextColorBasedOnBackground = (hexColor) => {
  // Verificar se hexColor é definido
  if (hexColor === undefined) {
    // Retornar uma cor padrão ou lançar um erro, dependendo da lógica desejada
    return "#000"; // Ou outra cor padrão
  }

  // Remover o caractere '#' se estiver presente
  const cleanedHex = hexColor.replace(/^#/, "");

  const r = parseInt(cleanedHex.slice(0, 2), 16);
  const g = parseInt(cleanedHex.slice(2, 4), 16);
  const b = parseInt(cleanedHex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000" : "#fff";
};

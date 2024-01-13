export const groupBy = (array, group) => {
  const grupos = [];

  for (let i = 0; i < array.length; i += group) {
    const grupo = array.slice(i, i + group);
    grupos.push(grupo);
  }

  return grupos;
};

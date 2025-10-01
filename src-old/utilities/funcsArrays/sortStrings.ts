
const sortStrings = (arr) => {
    return arr.sort((a, b) => {
      const [charA, restA] = a.split('-');
      const [charB, restB] = b.split('-');
  
      if (isNaN(charA) && isNaN(charB)) {
        // Ambos son letras, compara como cadenas
        return charA.localeCompare(charB);
      } else if (isNaN(charA)) {
        // A es una letra, colócala después de B (número)
        return 1;
      } else if (isNaN(charB)) {
        // B es una letra, colócala antes de A (número)
        return -1;
      } else {
        // Ambos son números, compara como números
        return parseInt(charA) - parseInt(charB);
      }
    });
};

export default sortStrings
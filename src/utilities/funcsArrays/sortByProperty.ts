
/**
 * Ordena de menor a mayor un array de objetos 
 * @param arr  array de objetos
 * @param prop propiedad con valor number
 * @returns array ordenado
 */
const sortByProperty = (arr: any[], prop: string): any[] => {
  if(arr.length == 0) return []
  return arr.slice().sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  });   
}

export default sortByProperty
import sortByProperty from "./sortByProperty";

export const groupByRepeatedValue = (arr, prop='eco', dontSort=false) => {
  if( !arr || arr.length == 0) return []
  const array = dontSort ? arr : sortByProperty( arr, prop );
  const result = [];
  let currentGroup = [];
  let currentValue = array[0][prop];
  
  array.forEach(item => {
    if (item[prop] == currentValue) {
      currentGroup.push(item);
    } else {
      result.push(currentGroup);
      currentGroup = [item];
      currentValue = item[prop];
    }
  });
  
  result.push(currentGroup);
  return result;
}

export default groupByRepeatedValue
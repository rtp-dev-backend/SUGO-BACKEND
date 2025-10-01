

const sortByDate = (arr: any[], prop='fecha') => {
  arr.sort((a, b) => { 
    const dateA = new Date(a[prop])
    const dateB = new Date(b[prop])
    return dateA.getTime() - dateB.getTime();
  });
  return arr;
}

export default sortByDate
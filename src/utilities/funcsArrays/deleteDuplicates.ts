
const deleteDuplicates = <T>(array: T[], props: (keyof T)[]|string): T[] => {
    const paresUnicos = new Set<string>();
    const resultado: T[] = [];
  
    array.forEach(obj => {
        let par
        if(Array.isArray(props)){
            const arrProps = props.map( (prop) => obj[prop] )
            par = arrProps.join('-');
        } 
        else if( typeof props == 'string' ){
            par = obj[props];
        } else throw new Error(`Error in deleteDuplicates(), second attribute must be string|string[]. Second attribute = ${props}`)
    
        
        if (!paresUnicos.has(par)) {
            paresUnicos.add(par);
            resultado.push(obj);
        }
    });
  
    return resultado;
};

export default deleteDuplicates
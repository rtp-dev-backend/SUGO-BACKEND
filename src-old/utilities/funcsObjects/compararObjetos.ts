export function compararObjetos(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const keys = [...new Set([...keys1, ...keys2])];

    const diferencias = {};
    keys.forEach(key => {
        if (obj1[key] !== obj2[key]) {
            diferencias[key] = { anterior: obj1[key], nuevo: obj2[key] };
        }
    });

    return diferencias;
}
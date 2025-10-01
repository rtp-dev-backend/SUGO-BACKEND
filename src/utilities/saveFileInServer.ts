import path from "path";


const saveFileInServer = (file, fileName: string, filePath: string, carpeta: string) => {
    // const extensionesValidas = ['jpeg', 'xlsx', 'pdf']
    const extensionesValidas = ['xlsx']
    return new Promise((resolve, reject) => {

        const nombre = file.name.split('.')
        const extension = nombre[nombre.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`);
        }

        const uploadPath = path.join(__dirname, '../../../files-sugo/', filePath, carpeta, fileName);

        file.mv(uploadPath, (err) => {
            if (err) reject(err);

            resolve(fileName);
        });
    });
}

export default saveFileInServer
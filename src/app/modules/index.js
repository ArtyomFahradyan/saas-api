const fs = require('fs');
let fileNames = fs.readdirSync(`${__dirname}`);
fileNames = fileNames.filter(fileName => {
    return fileName !== 'index.js';
});

const importCreator = async(dirs) => {
    const temp = {};
    dirs.forEach(async dir => {
        temp[`${dir}`] = await require(`./${dir}`).default;
    });

    return temp;
};

export default async(router) => {
    const imports = await importCreator(fileNames);

    const modules = await Object.keys(imports).map((key) => {
        return imports[key] = new imports[key](router);
    });

    modules.forEach((module) => module.createEndpoints());
};

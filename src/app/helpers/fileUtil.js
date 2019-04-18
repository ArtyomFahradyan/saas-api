const multiparty = require('multiparty');

export default class FileUtil {
    static async parseUploadForm(req) {
        const form = new multiparty.Form();

        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        fields,
                        files
                    });
                }
            });
        });
    }
}

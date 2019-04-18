import { FilesystemService } from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';

const fs = require('fs');

export class FilesController {
    static async getFiles(req, res, next) {
        try {
            let files = await FilesystemService.getAll();

            return res.status(SUCCESS_CODE).json(files);
        } catch (err) {
            next(err);
        }
    }

    static async download(req, res, next) {
        const { id } = req.params;
        try {
            let fileData = await FilesystemService.getById(id);

            let path = `uploads/${fileData.user}/${fileData.fileName}`;

            let stream = fs.createReadStream(path);

            let stat = fs.statSync(path);

            res.setHeader('Content-type', 'application/pdf');

            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileData.fileName}`);

            stream.pipe(res);

        } catch (err) {
            next(err);
        }
    }
}

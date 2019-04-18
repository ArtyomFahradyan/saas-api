import { SUCCESS_CODE } from '../../configs/status-codes';
import { BadRequest } from '../../errors';
import { INVALID } from '../../configs/constants';
import { AccountService, FilesystemService } from '../../services';
import FileUtil from '../../helpers/fileUtil';

const fs = require('fs');
const util = require('util');
const fileType = require('file-type');

export class FilesController {
    static async upload(req, res, next) {
        try {
            const parsedForm = await FileUtil.parseUploadForm(req);
            const { files } = parsedForm;

            if (files.files && files.files.length) {
                const originalName = files.files[0].originalFilename;

                await FilesystemService.checkUnique(originalName);

                const path = files.files[0].path;

                const readFile = util.promisify(fs.readFile);
                const buffer = await readFile(path);
                const type = fileType(buffer);

                if (!type.ext.includes('pdf')) {
                    throw new BadRequest(INVALID(`${type.ext} format`));
                }

                let uploadPath = `uploads/${req.user._id}`;

                if (!fs.existsSync(uploadPath)) {
                    await fs.mkdirSync(uploadPath);
                }

                fs.writeFile(`${uploadPath}/${originalName}`, buffer, async () => {
                    try {
                        const file = await FilesystemService.create(originalName, req.user);
                        await AccountService.updateAttachments(file._id, req.user);
                        console.log('The file has been saved!');

                    } catch (err) {
                        console.log(err);
                    }
                });
            }

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }
}

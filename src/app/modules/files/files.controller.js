import { SUCCESS_CODE } from '../../configs/status-codes';
import { BadRequest, Conflict, NotFound } from '../../errors';
import { INVALID, NOT_EXISTS, NEW_UPLOADED_FILE_MESSAGE, UPLOADED_FILE_MESSAGE } from '../../configs/constants';
import { AccountService, ContractService, FilesystemService, NotificationService } from '../../services';
import FileUtil from '../../helpers/fileUtil';
import Utils from '../../helpers/utils';
import { io } from '../../../server';

const fs = require('fs');
const util = require('util');
const fileType = require('file-type');

export class FilesController {
    static async getByAccount(req, res, next) {
        const { id } = req.params;
        try {
            const account = await AccountService.getById(id);

            if (!account) {
                throw new NotFound(NOT_EXISTS('Account'));
            }

            const files = await FilesystemService.getByAccount(account._id);

            return res.status(SUCCESS_CODE).json(files);
        } catch (e) {
            next(e);
        }
    }

    static async upload(req, res, next) {
        try {
            const parsedForm = await FileUtil.parseUploadForm(req);
            const { files, fields } = parsedForm;

            if (files.files && files.files.length) {
                const path = files.files[0].path;

                const contract = fields && fields.contract && fields.contract[0] || null;

                const readFile = util.promisify(fs.readFile);
                const buffer = await readFile(path);
                const type = fileType(buffer);

                if (!type.ext.includes('pdf')) {
                    throw new BadRequest(INVALID(`${type.ext} format`));
                }

                const newFileName = Utils.generateFileName();
                let uploadPath = `${req.user.account}/${newFileName}`;

                let existingFile = null;

                if (contract) {
                    existingFile = await FilesystemService.getByAccountAndContract(contract, req.user.account);
                }

                const location = await FileUtil.uploadFile(buffer, type, { fileName: uploadPath });

                let file;

                const account = await AccountService.getById(req.user.account);

                if (!contract) {
                    await NotificationService.create({
                        notes: NEW_UPLOADED_FILE_MESSAGE(account.company),
                        account: account._id
                    });

                    file = await FilesystemService.create({
                        fileName: newFileName,
                        account: req.user.account,
                        location: location.Location
                    });
                } else {
                    file = await FilesystemService.create({
                        fileName: newFileName,
                        account: req.user.account,
                        location: location.Location,
                        contract
                    });

                    await ContractService.update(fields.contract[0], {
                        attachment: file._id
                    });

                    await NotificationService.create({
                        notes: UPLOADED_FILE_MESSAGE(existingFile.contract),
                        account: req.user.account,
                        contract
                    });
                }

                io.emit(`NEW_FILE_UPLOADED`, {
                    message: 'Uploaded new file'
                });

                await AccountService.updateAttachments(file._id, req.user);

                return res.status(SUCCESS_CODE).json(file);
            } else {
                throw new Conflict();
            }

        } catch (e) {
            next(e);
        }
    }

    static async getDownloadLink(req, res, next) {
        const { id } = req.params;
        try {
            const file = await FilesystemService.getById(id);

            if (!file) {
                throw new NotFound(NOT_EXISTS('File'));
            }

            await FilesystemService.update(file._id, { isDownloaded: true });

            res.status(SUCCESS_CODE).json({ location: file.location });
        } catch (e) {
            next(e);
        }
    }

}

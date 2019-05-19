import validfilename from 'valid-filename';
import { AccountService, FilesystemService } from '../../../services';
import { SUCCESS_CODE } from '../../../configs/status-codes';
import { NotFound, ValidationError } from '../../../errors';
import { NOT_EXISTS, INVALID } from '../../../configs/constants';

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

    static async getFilesByAccount(req, res, next) {
        const { id } = req.params;
        try {
            let account = await AccountService.getById(id);

            if (!account) {
                throw new NotFound(NOT_EXISTS('Account'));
            }

            let files = await FilesystemService.getByAccount(account._id);

            return res.status(SUCCESS_CODE).json(files);
        } catch (err) {
            next(err);
        }
    }

    static async renameFile(req, res, next) {
        const { id } = req.params;
        let { alias } = req.body;

        try {
            const file = await FilesystemService.getById(id);

            if(!file) {
                throw new NotFound(NOT_EXISTS('File'));
            }

            alias = alias.trim();

            if(!validfilename(alias)) {
                throw new ValidationError(INVALID('File Name'));
            }

            await FilesystemService.update(id, { alias });

            return res.status(SUCCESS_CODE).json({ success: true });

        } catch (err) {
            next(err);
        }

    }
}

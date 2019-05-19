const multiparty = require('multiparty');
import params from '../configs/params';
const AWS = require('aws-sdk');

export default class FileUtil {

    static async uploadFile(buffer, type, args) {
        const S3 = new AWS.S3();

        const options = {
            ACL: 'public-read',
            Body: buffer,
            Bucket: params.s3Bucket,
            ContentType: type.mime,
            Key: args.fileName
        };

        return await S3.upload(options)
                .promise();
    }

    static async removeFile(fileName, folder) {
        const S3 = new AWS.S3();

        const options = {
            Bucket: params.s3Bucket,
            Key: `${folder}/${fileName}`
        };

        return await S3.deleteObject(options)
                .promise();
    }

    static async rename(args) {
        const S3 = new AWS.S3();

        try {
            const options = {
                ACL: 'public-read',
                Bucket: params.s3Bucket,
                CopySource: `${params.s3Bucket}/${args.fileName}`,
                Key: args.newName
            };

            return await S3.copyObject(options).promise();
        } catch (e) {
            console.log(e);
        }
    }

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

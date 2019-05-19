import {
    AccountService,
    ContractService,
    FilesystemService,
    NotificationService,
    PlatformService,
    TeamService,
    TransactionService
} from '../../../services';
import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../../configs/status-codes';
import { NotFound } from '../../../errors';
import { NOT_EXISTS } from '../../../configs/constants';
import Handlers from '../../../helpers/handlers';
import { ObjectID } from 'bson';
import { io } from '../../../../server';
import moment from 'moment';
import _ from 'lodash';

export class ContractsController {
    static async getByAccount(req, res, next) {
        const { id } = req.params;
        const query = req.query;
        try {
            const proxy = new Proxy(query, Handlers.queryHandler());
            const accountId = new ObjectID(id);

            const contracts = await ContractService.getUserContracts(accountId, proxy);

            return res.status(SUCCESS_CODE).json(contracts);
        } catch (err) {
            next(err);
        }
    }

    static async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const contract = await ContractService.getOne(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Contract'));
            }

            const notifications = await NotificationService.getByParams({
                contract: contract._id,
                seen: false
            });

            if (notifications && notifications.length) {
                io.emit('NEW_NOTIFICATION', {
                    message: 'Notification view'
                });

                notifications.forEach(async (notification) => {
                    await NotificationService.update(notification._id, { seen: true });
                });

            }

            return res.status(SUCCESS_CODE).json(contract);
        } catch (err) {
            next(err);
        }
    }

    static async addContract(req, res, next) {
        const payload = req.body;
        try {
            let customTeam = null, customPlatform = null;

            if (!ObjectID.isValid(payload.team)) {
                customTeam = await TeamService.create({
                    name: payload.team,
                    account: payload.account
                });
            } else {
                let team = await TeamService.getById(payload.team);
                let accounts = await team.accounts.filter((item) => item.toString() !== payload.account.toString());
                accounts.push(payload.account.toString());

                await TeamService.update(payload.team, { accounts });
            }

            if (!ObjectID.isValid(payload.platform)) {
                customPlatform = await PlatformService.create({
                    name: payload.platform,
                });
            }

            const attributes = {
                account: payload.account,
                team: customTeam ? customTeam._id : payload.team,
                platform: customPlatform ? customPlatform._id : payload.platform,
                startedAt: payload.startedAt,
                endedAt: payload.endedAt,
                renewalAt: payload.renewalAt,
                price: payload.price,
                paidUsersCount: payload.paidUsersCount,
                freeUsersCount: payload.freeUsersCount,
                paidEmailsSentCount: payload.paidEmailsSentCount,
                freeEmailsSentCount: payload.freeEmailsSentCount,
                paidProjectsCount: payload.paidProjectsCount,
                freeProjectsCount: payload.freeProjectsCount,
                trialPeriod: payload.trialPeriod,
                paidSupportTier: payload.paidSupportTier,
                freeSupportTier: payload.freeSupportTier,
                notes: payload.notes,
                customField: payload.customField,
                attachment: payload.attachment,
                usage: payload.usage,
                paymentFrequency: payload.paymentFrequency,
                paymentTerms: payload.paymentTerms,
            };

            const contract = await ContractService.create(attributes);

            const payments = await ContractService.getEachPayment(contract._id);

            await TransactionService.create(payments.dates , payments.cost, contract._id);

            const file = await FilesystemService.getById(payload.attachment);

            await FilesystemService.update(file._id, { contract: contract._id });

            await AccountService.incOrDecContract(contract, true);

            await PlatformService.updateAveragePrice(customPlatform ? customPlatform._id : payload.platform, payload.usage);

            return res.status(SUCCESS_CODE).json(contract);
        } catch(err) {
            next(err);
        }
    }

    static async editContact(req, res, next) {
        const payload = req.body;
        const { id } = req.params;
        try {
            let customTeam = null, customPlatform = null;
            let contract = await ContractService.getById(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Contract'));
            }

            if (payload.team && !ObjectID.isValid(payload.team)) {
                customTeam = await TeamService.create({
                    name: payload.team,
                    account: payload.account
                });
            } else if (payload.team && ObjectID.isValid(payload.team)) {
                let team = await TeamService.getById(payload.team);
                let accounts = [];
                if (!team.accounts.length) {
                    accounts = [payload.account];
                } else {
                    accounts = [ ...team.accounts, payload.account ];
                }

                await TeamService.update(payload.team, { accounts });
            }

            if (payload.platform && !ObjectID.isValid(payload.platform)) {
                customPlatform = await PlatformService.create({
                    name: payload.platform,
                });
            }

            const attributes = {
                account: payload.account,
                team: customTeam ? customTeam._id : payload.team,
                platform: customPlatform ? customPlatform._id : payload.platform,
                startedAt: payload.startedAt,
                endedAt: payload.endedAt,
                renewalAt: payload.renewalAt,
                price: payload.price,
                paidUsersCount: payload.paidUsersCount,
                freeUsersCount: payload.freeUsersCount,
                paidEmailsSentCount: payload.paidEmailsSentCount,
                freeEmailsSentCount: payload.freeEmailsSentCount,
                paidProjectsCount: payload.paidProjectsCount,
                freeProjectsCount: payload.freeProjectsCount,
                trialPeriod: payload.trialPeriod,
                paidSupportTier: payload.paidSupportTier,
                freeSupportTier: payload.freeSupportTier,
                notes: payload.notes,
                attachment: payload.attachment,
                customField: payload.customField,
                usage: payload.usage,
                paymentFrequency: payload.paymentFrequency,
                paymentTerms: payload.paymentTerms,
            };

            if (payload.attachment.toString() !== contract.attachment.toString()) {
                await FilesystemService.update(payload.attachment, {
                    contract: contract._id
                });
            }

            let editedContract = await ContractService.update(contract._id, attributes);

            if( !moment(editedContract.startedAt).isSame(contract.startedAt) ||
                !moment(editedContract.endedAt).isSame(contract.endedAt) ||
                editedContract.paymentFrequency !== contract.paymentFrequency ||
                editedContract.price !== contract.price ||
                editedContract.platform !== contract.platform) {

                await TransactionService.delete(contract._id);

                const payments = await ContractService.getEachPayment(contract._id);
                await TransactionService.create(payments.dates, payments.cost , contract._id);
            }

            if (contract.platform.toString() !== editedContract.platform.toString() ||
                contract.price !== editedContract.price || contract.usage !== editedContract.usage) {
                await PlatformService.updateAveragePrice(customPlatform ? customPlatform._id : editedContract.platform, editedContract.usage);
                await PlatformService.updateAveragePrice(contract.platform, contract.usage);
            }

            contract = await ContractService.getOne(id);

            return res.status(SUCCESS_CODE).json(contract);
        } catch(err) {
            next(err);
        }
    }

    static async deleteContract(req, res, next) {
        const { id } = req.params;
        try {
            let contract = await ContractService.getById(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Contract'));
            }

            const attributes = {
                isDeleted: true
            };

            await ContractService.update(contract._id, attributes);

            await PlatformService.updateAveragePrice(contract.platform, contract.usage);

            await AccountService.incOrDecContract(contract, false);

            return res.status(NO_CONTENT_CODE).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAttachmentsByContract(req, res, next) {
        const { id } = req.params;
        try {
            const contract = await ContractService.getById(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Contract'));
            }

            const files = await FilesystemService.getByContract(contract._id);

            return res.status(SUCCESS_CODE).json(files);
        } catch (e) {
            next(e);
        }
    }
}

import { AccountService, ContractService, NotificationService, PlatformService, TeamService } from '../../../services';
import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../../configs/status-codes';
import { NotFound } from '../../../errors';
import { NOT_EXISTS } from '../../../configs/constants';
import Handlers from '../../../helpers/handlers';
import { ObjectID } from 'bson';
import { io } from '../../../../server';

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
                usage: payload.usage
            };

            const contract = await ContractService.create(attributes);

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
                customField: payload.customField,
                usage: payload.usage
            };

            let editedContract = await ContractService.update(contract._id, attributes);

            if (contract.platform.toString() !== editedContract.platform.toString() ||
                contract.price !== editedContract.price) {
                await PlatformService.updateAveragePrice(customPlatform ? customPlatform._id : payload.platform, payload.usage);
                await PlatformService.updateAveragePrice(customPlatform ? customPlatform._id : payload.platform, payload.usage);
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
}

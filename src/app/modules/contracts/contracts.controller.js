import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../configs/status-codes';
import Handlers from '../../helpers/handlers';
import { AdminService, ContractService, NotificationService } from '../../services';
import { NotFound } from '../../errors';
import { NOT_EXISTS } from '../../configs/constants';
import { io } from '../../../server';

export class ContractsController {
    static async getUserContracts(req, res, next) {
        const user = req.user;
        const query = req.query;
        try {
            const proxy = new Proxy(query, Handlers.queryHandler());

            const contracts = await ContractService.getUserContracts(user.account, proxy, true);

            return res.status(SUCCESS_CODE).json(contracts);
        } catch (e) {
            next(e);
        }
    }

    static async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const contract = await ContractService.getOne(id);

            return res.status(SUCCESS_CODE).json(contract);
        } catch (e) {
            next(e);
        }
    }

    // static async getContractAndAverage(req, res, next) {
    //     const { id } = req.params;
    //     try {
    //         const contract = await ContractService.getOne(id);
    //         const avgContract = await ContractService.getAverageContract(req.user.account);
    //         const difference = await ContractService.getDifference(contract, avgContract);
    //
    //         return res.status(SUCCESS_CODE).json({
    //             contract,
    //             avgContract,
    //             difference
    //         });
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    static async notify(req, res, next) {
        const { id } = req.params;
        const { notifyAdmin, notes, customField } = req.body;
        try {
            const contract = await ContractService.getById(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Contract'));
            }

            await ContractService.update(contract._id, {
                notes,
                customField
            });

            if (notifyAdmin) {
                await AdminService.sendNotificationMail(contract._id);

                io.emit('NEW_NOTIFICATION', {
                    message: 'You have new notification'
                });

                const attributes = {
                    contract: contract._id,
                    account: contract.account,
                    notes
                };
                await NotificationService.create(attributes);
            }

            return res.status(SUCCESS_CODE).json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }

    static async getByRenewal(req, res, next) {
        try {
            let contracts = await ContractService.getByRenewal();

            return res.status(SUCCESS_CODE).json(contracts);
        } catch (e) {
            next(e);
        }
    }

    static async delete(req, res, next) {
        const { id } = req.params;
        try {
            const contract = await ContractService.getById(id);

            if (!contract) {
                throw new NotFound(NOT_EXISTS('Service'));
            }

            const attributes = { isDeleted: true };

            await ContractService.update(contract._id, attributes);

            return res.status(NO_CONTENT_CODE).json({});
        } catch (e) {
            next(e);
        }
    }
}

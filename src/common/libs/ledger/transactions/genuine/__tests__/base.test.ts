/* eslint-disable spellcheck/spell-checker */
/* eslint-disable max-len */

import LedgerService from '@services/LedgerService';
import NetworkService from '@services/NetworkService';

import { TransactionTypes } from '../../../types';

import BaseTransaction from '../BaseTransaction';

import Memo from '../../../parser/common/memo';
import { txFlags } from '../../../parser/common/flags/txFlags';

import txTemplates from './fixtures/BaseTx.json';
import paymentTemplates from './fixtures/PaymentTx.json';
import invokeTemplate from './fixtures/InvokeTx.json';

jest.mock('@services/NetworkService');

describe('BaseTransaction', () => {
    describe('Set & Get', () => {
        it('Should return right parsed values for all fields', () => {
            const { tx, meta } = txTemplates;

            const instance = new BaseTransaction(tx, meta);

            expect(instance.Account).toStrictEqual({
                tag: 456,
                address: tx.Account,
            });
            expect(instance.Memos).toStrictEqual([
                { MemoData: 'XRP Tip Bot', MemoFormat: undefined, MemoType: 'XrpTipBotNote' },
            ]);
            expect(instance.Fee).toBe('0.000012');
            expect(instance.Date).toBe('2020-09-02T07:24:11.000Z');
            expect(instance.Hash).toBe(tx.hash);
            expect(instance.SigningPubKey).toBe(tx.SigningPubKey);
            expect(instance.LedgerIndex).toBe(tx.ledger_index);
            expect(instance.LastLedgerSequence).toBe(tx.LastLedgerSequence);
            expect(instance.Sequence).toBe(tx.Sequence);
            expect(instance.TxnSignature).toBe(tx.TxnSignature);
            expect(instance.NetworkID).toBe(tx.NetworkID);
            expect(instance.OperationLimit).toBe(tx.OperationLimit);
            expect(instance.EmitDetails).toBe(tx.EmitDetails);
            expect(instance.FirstLedgerSequence).toBe(tx.FirstLedgerSequence);
            expect(instance.TicketSequence).toBe(tx.TicketSequence);
            expect(instance.Flags).toStrictEqual({ FullyCanonicalSig: true });
            expect(instance.Signers).toStrictEqual(
                tx.Signers.flatMap((item) => {
                    return {
                        account: item.Signer.Account,
                        signature: item.Signer.TxnSignature,
                        pubKey: item.Signer.SigningPubKey,
                    };
                }),
            );
            expect(instance.HookParameters).toStrictEqual(tx.HookParameters);
            expect(instance.TransactionResult).toStrictEqual({
                success: true,
                code: 'tesSUCCESS',
                message: undefined,
            });
        });

        it('Should Set/Get common fields', () => {
            const instance = new BaseTransaction();

            instance.TransactionType = TransactionTypes.Payment;
            expect(instance.TransactionType).toBe(TransactionTypes.Payment);

            instance.Account = {
                address: 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
                tag: 456,
            };
            expect(instance.Account).toStrictEqual({
                tag: 456,
                address: 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
            });

            instance.Memos = [];
            expect(instance.Memos).toBeUndefined();
            instance.Memos = [Memo.Encode('Memo Description')];
            expect(instance.Memos).toStrictEqual([
                { MemoData: 'Memo Description', MemoFormat: 'text/plain', MemoType: 'Description' },
            ]);

            instance.Fee = '0.000012';
            expect(instance.Fee).toBe('0.000012');

            instance.Hash = '7F10793B5781BD5DD52F70096520321A08DD2ED19AFC7E3F193AAC293954F7DF';
            expect(instance.Hash).toBe('7F10793B5781BD5DD52F70096520321A08DD2ED19AFC7E3F193AAC293954F7DF');

            instance.Sequence = 34306;
            expect(instance.Sequence).toBe(34306);

            instance.LastLedgerSequence = 57913677;
            expect(instance.LastLedgerSequence).toBe(57913677);

            instance.SigningPubKey = '03DF3AB842EB1B57F0A848CD7CC2CFD35F66E4AD0625EEACFFE72A45E4D13E49A';
            expect(instance.SigningPubKey).toBe('03DF3AB842EB1B57F0A848CD7CC2CFD35F66E4AD0625EEACFFE72A45E4D13E49A');

            instance.FirstLedgerSequence = 1;
            expect(instance.FirstLedgerSequence).toBe(1);

            instance.OperationLimit = 1337;
            expect(instance.OperationLimit).toBe(1337);

            instance.NetworkID = 0;
            expect(instance.NetworkID).toBe(0);

            instance.TicketSequence = 123;
            expect(instance.TicketSequence).toBe(123);

            instance.TransactionIndex = 1;
            expect(instance.TransactionIndex).toBe(1);

            instance.LedgerIndex = 1337;
            expect(instance.LedgerIndex).toBe(1337);

            instance.TxnSignature = 'TxnSignature';
            expect(instance.TxnSignature).toBe('TxnSignature');

            instance.PreviousTxnID = '7F10793B5781BD5DD52F70096520321A08DD2ED19AFC7E3F193AAC293954F7DF';
            expect(instance.PreviousTxnID).toBe('7F10793B5781BD5DD52F70096520321A08DD2ED19AFC7E3F193AAC293954F7DF');

            instance.Signers = [
                {
                    Signer: {
                        Account: 'rSignerxxxxxxxxxxxxxxxxxxxxxxxxxx',
                        TxnSignature: 'TxnSignature',
                        SigningPubKey: 'SigningPubKey',
                    },
                },
            ];
            expect(instance.Signers).toStrictEqual([
                {
                    account: 'rSignerxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    signature: 'TxnSignature',
                    pubKey: 'SigningPubKey',
                },
            ]);

            instance.Flags = [txFlags.Payment.PartialPayment, txFlags.Payment.LimitQuality];
            expect(instance.Flags).toStrictEqual({
                PartialPayment: true,
                FullyCanonicalSig: false,
                LimitQuality: true,
                NoRippleDirect: false,
            });
        });

        it('should return an tx json with only the allowed fields', () => {
            const txData = {
                TransactionType: 'Payment',
                Amount: 1337,
                RegularKey: 'rAccountxxxxxxxxxxxxxxxxxxxxxxxxxx',
            };
            const allowedFields = ['TransactionType', 'Amount'];

            const transaction = new BaseTransaction(txData);
            // @ts-ignore
            transaction.fields = allowedFields;
            const jsonResult = transaction.Json;

            expect(jsonResult).toEqual({ TransactionType: 'Payment', Amount: 1337 });
        });

        it('Should return the ctid from tx if present', () => {
            const { tx, meta } = invokeTemplate;
            const instance = new BaseTransaction(tx, meta);
            expect(instance.CTID).toBe('C000002D00005359');
        });

        it('Should be able to generate the right CTID', () => {
            const { tx, meta } = paymentTemplates.XRP2XRP;
            const instance = new BaseTransaction(tx, meta);
            expect(instance.CTID).toBe('C373B14A00040000');
        });
    });

    describe('Prepare & Signing', () => {
        it('Should return right transaction result', () => {
            const instance = new BaseTransaction();

            // transaction already verified by network
            // @ts-ignore
            instance.meta.TransactionResult = 'tesSUCCESS';

            expect(instance.TransactionResult).toStrictEqual({
                success: true,
                code: 'tesSUCCESS',
                message: undefined,
            });

            // transaction is not verified by network and failed
            // @ts-ignore
            instance.meta.TransactionResult = 'tecNO_LINE_INSUF_RESERVE';

            instance.SubmitResult = {
                success: true,
                engineResult: 'tecNO_LINE_INSUF_RESERVE',
                message: 'No such line. Too little reserve to create it.',
                network: {
                    id: 0,
                    node: 'wss://xrplcluster.com',
                    type: 'Mainnet',
                    key: 'MAINNET',
                },
            };

            instance.VerifyResult = {
                success: false,
            };

            expect(instance.TransactionResult).toStrictEqual({
                success: false,
                code: 'tecNO_LINE_INSUF_RESERVE',
                message: 'No such line. Too little reserve to create it.',
            });

            // transaction is not verified by network and hard failed
            // @ts-ignore
            instance.meta.TransactionResult = undefined;

            instance.SubmitResult = {
                success: false,
                engineResult: 'temBAD_FEE',
                message: 'temBAD_FEE description',
                network: {
                    id: 0,
                    node: 'wss://xrplcluster.com',
                    type: 'Mainnet',
                    key: 'MAINNET',
                },
            };

            instance.VerifyResult = {
                success: false,
            };

            expect(instance.TransactionResult).toStrictEqual({
                success: false,
                code: 'temBAD_FEE',
                message: 'temBAD_FEE description',
            });
        });

        it('Should be able to prepare the transaction for signing', async () => {
            const address = 'rEAa7TDpBdL1hoRRAp3WDmzBcuQzaXssmb';

            // mock the ledger service response
            const spy = jest.spyOn(LedgerService, 'getAccountInfo').mockImplementation(() =>
                Promise.resolve({
                    account_data: {
                        Account: address,
                        Balance: '49507625423',
                        Flags: 131072,
                        OwnerCount: 1135,
                        PreviousTxnID: '48DB4C987EDE802030089C48F27FF7A0F589EBA7C3A9F90873AA030D5960F149',
                        PreviousTxnLgrSeq: 58057100,
                        Sequence: 34321,
                    },
                    networkId: 0,
                }),
            );

            // create a transaction instance for signing
            const { tx, meta } = paymentTemplates.SimplePayment;
            const instance = new BaseTransaction(tx, meta);

            // prepare the transaction by applying the private key
            await instance.prepare(undefined);

            // run test to check if it properly prepared transaction
            expect(instance.Account).toStrictEqual({
                tag: undefined,
                address,
            });

            // should set the sequence number
            expect(instance.Sequence).toBe(34321);

            spy.mockRestore();
        });

        it('Should be able to populate the transaction LastLedgerSequence', async () => {
            const LastLedger = 68312096;

            // mock the ledger service response
            const spy = jest.spyOn(LedgerService, 'getLedgerStatus').mockImplementation(() => {
                return { Fee: 12, LastLedger };
            });

            // should set if LastLedgerSequence undefined
            const { tx, meta } = paymentTemplates.SimplePayment;
            const instance = new BaseTransaction(tx, meta);
            instance.LastLedgerSequence = undefined;
            instance.populateFields();
            expect(instance.LastLedgerSequence).toBe(LastLedger + 10);

            // should update LastLedgerSequence if sequence is passed
            instance.LastLedgerSequence = LastLedger - 500;
            instance.populateFields();
            expect(instance.LastLedgerSequence).toBe(LastLedger + 10);

            // should update LastLedgerSequence if sequence is less than 32570
            instance.LastLedgerSequence = 50;
            instance.populateFields();
            expect(instance.LastLedgerSequence).toBe(LastLedger + 50);

            spy.mockRestore();
        });

        describe('Should be able to handle setting NetworkID', () => {
            let getLedgerStatusSpy: any;

            beforeAll(() => {
                // mock the ledger service response
                getLedgerStatusSpy = jest.spyOn(LedgerService, 'getLedgerStatus').mockImplementation(() => {
                    return { Fee: 12, LastLedger: 123 };
                });
            });

            afterAll(() => {
                getLedgerStatusSpy.mockRestore();
            });

            it('Should populate the transaction NetworkID on NON legacy networks', async () => {
                const connectedNetworkId = 1337;

                // mock the ledger service response
                const spy = jest.spyOn(NetworkService, 'getNetworkId').mockImplementation(() => {
                    return connectedNetworkId;
                });

                const { tx, meta } = paymentTemplates.SimplePayment;
                const instance = new BaseTransaction(tx, meta);

                instance.populateFields();
                expect(instance.NetworkID).toBe(connectedNetworkId);

                spy.mockRestore();
            });

            it('Should not populate the transaction NetworkID on legacy networks', async () => {
                const connectedNetworkId = 0;

                // mock the ledger service response
                const spy = jest.spyOn(NetworkService, 'getNetworkId').mockImplementation(() => {
                    return connectedNetworkId;
                });

                // should set if LastLedgerSequence undefined
                const { tx, meta } = paymentTemplates.SimplePayment;
                const instance = new BaseTransaction({ tx }, meta);

                instance.populateFields();
                expect(instance.NetworkID).toBe(undefined);

                spy.mockRestore();
            });
        });

        it('Should be able to generate the right CTID', () => {
            const { tx, meta } = paymentTemplates.XRP2XRP;
            const instance = new BaseTransaction(tx, meta);
            expect(instance.CTID).toBe('C373B14A00040000');
        });
    });
});

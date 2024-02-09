import lodash from 'lodash';
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  let initialBalance = 0;
  let transferAmount = 0;
  let account = getBankAccount(initialBalance);
  let recipientAccount = getBankAccount(initialBalance);

  beforeEach(() => {
    initialBalance = 100;
    transferAmount = 100;
    account = getBankAccount(initialBalance);
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawAmount = 150;

    expect(() => account.withdraw(withdrawAmount)).toThrow(
      InsufficientFundsError,
    );

    try {
      account.withdraw(withdrawAmount);
    } catch (error) {
      expect(error).toBeInstanceOf(InsufficientFundsError);
    }
  });

  test('should throw error when transferring more than balance', () => {
    transferAmount = 150;

    expect(() => account.transfer(transferAmount, recipientAccount)).toThrow(
      InsufficientFundsError,
    );

    try {
      account.transfer(transferAmount, recipientAccount);
    } catch (error) {
      expect(error).toBeInstanceOf(InsufficientFundsError);
    }
  });

  test('should throw error when transferring to the same account', () => {
    recipientAccount = account;

    expect(() => account.transfer(transferAmount, recipientAccount)).toThrow(
      TransferFailedError,
    );

    try {
      account.transfer(transferAmount, recipientAccount);
    } catch (error) {
      expect(error).toBeInstanceOf(TransferFailedError);
    }
  });

  test('should deposit money', () => {
    const depositAmount = 100;
    account.deposit(depositAmount);

    expect(account.getBalance()).toEqual(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const withdrawAmount = 50;
    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toEqual(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    account.transfer(transferAmount, recipientAccount);

    expect(account.getBalance()).toEqual(initialBalance - transferAmount);
    expect(recipientAccount.getBalance()).toEqual(
      initialBalance + transferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchBalance = 75;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(fetchBalance)
      .mockReturnValueOnce(1);

    const result = await account.fetchBalance();
    expect(result).toEqual(fetchBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = 75;
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(balance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toEqual(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    try {
      await account.synchronizeBalance();
    } catch (error) {
      expect(error).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});

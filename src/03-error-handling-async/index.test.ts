import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

const testCases = {
  resolveValue: 'Lorem ipsum',
  throwError: "That's an error",
};

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const data = await resolveValue(testCases['resolveValue']);
    expect(data).toBe(testCases['resolveValue']);
    await expect(resolveValue(testCases['resolveValue'])).resolves.toBe(
      testCases['resolveValue'],
    );
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => {
      throwError(testCases['throwError']);
    }).toThrow();
    expect(() => {
      throwError(testCases['throwError']);
    }).toThrow(testCases['throwError']);

    try {
      throwError(testCases['throwError']);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrow();
    expect(throwError).toThrow(/Oops/);

    try {
      throwError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrow();
    expect(throwCustomError).toThrow(MyAwesomeError);
    try {
      throwCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);

    try {
      await rejectCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
    }
  });
});

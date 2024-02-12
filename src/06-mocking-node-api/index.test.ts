import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';

const timer = 1000;
const fakeFile = 'test.txt';

jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, timer);
    expect(setTimeout).toBeCalledWith(callback, timer);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, timer);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(timer);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, timer);
    expect(setInterval).toBeCalledWith(callback, timer);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, timer);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(timer);
    expect(callback).toBeCalledTimes(1);

    jest.advanceTimersByTime(timer);
    expect(callback).toBeCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const fakeJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(fakeFile);
    expect(fakeJoin).toBeCalled();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fsSync, 'existsSync').mockReturnValue(false);

    const content = await readFileAsynchronously(fakeFile);
    expect(content).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fsSync, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fs, 'readFile')
      .mockResolvedValue(<Buffer>{ toString: () => '' });

    const content = await readFileAsynchronously(fakeFile);
    expect(typeof content).toBe('string');
  });
});

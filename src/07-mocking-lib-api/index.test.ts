import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});

const baseURL = 'https://jsonplaceholder.typicode.com';
const fakePath = 'api';

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const fakeAxiosCreate = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(fakePath);

    expect(fakeAxiosCreate).toBeCalledWith(baseURL);
  });

  test('should perform request to correct provided url', async () => {
    const fakeAxiosGet = jest.spyOn(axios, 'get');
    await throttledGetDataFromApi(fakePath);

    expect(fakeAxiosGet).toBeCalledWith(fakePath);
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi(fakePath);

    expect(data).toBe('mockedData');
  });
});

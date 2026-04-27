import { afterEach, describe, expect, jest, test } from '@jest/globals';

import { createCrudService } from '@/services/create-crud-service';
import { axiosInstance } from '@/services/instance';

describe('CRUD сервіс', () => {
  const endpoint = '/rooms';
  const service = createCrudService(endpoint);

  const mockId = 1;
  const mockData = { id: 1, name: 'Room 1' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll: перевірка отримання списку', async () => {
    const getSpy = jest.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: [mockData] });

    await expect(service.getAll()).resolves.toEqual([mockData]);
    expect(axiosInstance.get).toHaveBeenCalledWith(endpoint, expect.any(Object));

    getSpy.mockRestore();
  });

  test('update: має викликати PATCH (згідно з твоєю реалізацією)', async () => {
    const payload = { name: 'Updated Name' };
    const patchSpy = jest.spyOn(axiosInstance, 'patch').mockResolvedValueOnce({
      data: { ...mockData, ...payload },
    });

    const result = await service.update(mockId, payload);

    expect(result).toEqual({ ...mockData, ...payload });
    expect(axiosInstance.patch).toHaveBeenCalledWith(`${endpoint}/${mockId}`, payload);

    patchSpy.mockRestore();
  });

  test('remove: має викликати DELETE', async () => {
    const deleteSpy = jest.spyOn(axiosInstance, 'delete').mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await service.remove(mockId);

    expect(result).toEqual({ success: true });
    expect(axiosInstance.delete).toHaveBeenCalledWith(`${endpoint}/${mockId}`);

    deleteSpy.mockRestore();
  });
});

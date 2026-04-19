import { axiosInstance } from './instance';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

export function createCrudService<TEntity, TCreate = unknown, TUpdate = unknown>(route: string) {
  return {
    getAll: async (params?: QueryParams): Promise<TEntity[]> => {
      return (await axiosInstance.get<TEntity[]>(route, { params })).data;
    },
    getById: async (id: number | string): Promise<TEntity> => {
      return (await axiosInstance.get<TEntity>(`${route}/${id}`)).data;
    },
    create: async (payload: TCreate): Promise<TEntity> => {
      return (await axiosInstance.post<TEntity>(route, payload)).data;
    },
    update: async (id: number | string, payload: TUpdate): Promise<TEntity> => {
      return (await axiosInstance.patch<TEntity>(`${route}/${id}`, payload)).data;
    },
    remove: async (id: number | string): Promise<TEntity> => {
      return (await axiosInstance.delete<TEntity>(`${route}/${id}`)).data;
    },
  };
}

import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { VerificationCodeCreateInput, VerificationCodeDto, VerificationCodeUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  VerificationCodeDto,
  VerificationCodeCreateInput,
  VerificationCodeUpdateInput
>(ApiRoutes.VERIFICATION_CODES);

import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountServiceDto } from './create-account-service.dto';

export class UpdateAccountServiceDto extends PartialType(CreateAccountServiceDto) {}
import { PartialType } from '@nestjs/mapped-types';
import { CreateRealEstateDto } from './create-real-estate.dto';

export class UpdateRealEstateDto extends PartialType(CreateRealEstateDto) {}

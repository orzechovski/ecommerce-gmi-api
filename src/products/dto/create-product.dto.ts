import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_giftcard?: boolean;

  @IsString()
  @IsOptional()
  status?: string;
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  profile_id?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsString()
  @IsOptional()
  hs_code?: string;

  @IsString()
  @IsOptional()
  origin_country?: string;

  @IsString()
  @IsOptional()
  mid_code?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsString()
  @IsOptional()
  collection_id?: string;

  @IsString()
  @IsOptional()
  type_id?: string;

  @IsBoolean()
  @IsOptional()
  discountable?: boolean;

  @IsString()
  @IsOptional()
  external_id?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

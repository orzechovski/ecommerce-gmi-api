import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreateProductDto {
  @ApiProperty({ description: 'Title of the product', example: 'New Product' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Subtitle of the product',
    example: 'Product Subtitle',
    required: false,
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ description: 'Number of items in stock', example: 10 })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a great product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Is this a gift card?',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_giftcard?: boolean;

  @ApiProperty({
    description: 'Status of the product',
    example: 'published',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'http://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ description: 'Profile ID for the product', required: false })
  @IsString()
  @IsOptional()
  profile_id?: string;

  @ApiProperty({
    description: 'Weight of the product',
    example: 1.2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Price of the product', example: 49.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Length of the product',
    example: 10.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiProperty({
    description: 'Height of the product',
    example: 5.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({
    description: 'Width of the product',
    example: 3.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: 'HS Code of the product', required: false })
  @IsString()
  @IsOptional()
  hs_code?: string;

  @ApiProperty({ description: 'Country of origin', required: false })
  @IsString()
  @IsOptional()
  origin_country?: string;

  @ApiProperty({ description: 'MID Code of the product', required: false })
  @IsString()
  @IsOptional()
  mid_code?: string;

  @ApiProperty({
    description: 'Material used for the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({
    description: 'Collection ID for the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  collection_id?: string;

  @ApiProperty({ description: 'Type ID for the product', required: false })
  @IsString()
  @IsOptional()
  type_id?: string;

  @ApiProperty({
    description: 'Is the product discountable?',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  discountable?: boolean;

  @ApiProperty({ description: 'External ID for the product', required: false })
  @IsString()
  @IsOptional()
  external_id?: string;

  @ApiProperty({
    description: 'Additional metadata for the product',
    required: false,
  })
  @IsOptional()
  metadata?: JsonValue;
}

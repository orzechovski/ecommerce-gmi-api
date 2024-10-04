import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { JsonValue } from '@prisma/client/runtime/library';

export class ProductDto extends CreateProductDto {
  @ApiProperty({
    description: 'ID of the product',
    example: 'cm1tmifx60001ntuqpp2v6x7i',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Title of the product',
    example: 'Sample Product',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Subtitle of the product',
    example: 'Sample Subtitle',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  subtitle: string | null;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a sample product for testing.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Is this product a gift card?', example: false })
  @IsBoolean()
  @IsNotEmpty()
  is_giftcard: boolean;

  @ApiProperty({ description: 'Status of the product', example: 'draft' })
  @IsString()
  @IsOptional()
  status: string | null;

  @ApiProperty({ description: 'Thumbnail URL', example: null, nullable: true })
  @IsString()
  @IsOptional()
  thumbnail: string | null;

  @ApiProperty({
    description: 'Profile ID associated with the product',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  profile_id: string | null;

  @ApiProperty({
    description: 'Weight of the product',
    example: 1.2,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  weight: number | null;

  @ApiProperty({ description: 'Price of the product', example: 49.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Length of the product',
    example: null,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  length: number | null;

  @ApiProperty({
    description: 'Height of the product',
    example: null,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  height: number | null;

  @ApiProperty({
    description: 'Width of the product',
    example: null,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  width: number | null;

  @ApiProperty({
    description: 'HS Code of the product',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  hs_code: string | null;

  @ApiProperty({
    description: 'Country of origin',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  origin_country: string | null;

  @ApiProperty({
    description: 'MID code of the product',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  mid_code: string | null;

  @ApiProperty({
    description: 'Material used in the product',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  material: string | null;

  @ApiProperty({
    description: 'Collection ID the product belongs to',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  collection_id: string | null;

  @ApiProperty({
    description: 'Product type ID',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  type_id: string | null;

  @ApiProperty({ description: 'Is the product discountable?', example: true })
  @IsBoolean()
  @IsOptional()
  discountable: boolean;

  @ApiProperty({
    description: 'External ID of the product',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  external_id: string | null;

  @ApiProperty({
    description: 'Creation date of the product',
    example: '2024-10-03T18:22:03.516Z',
  })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the product',
    example: '2024-10-03T18:22:03.516Z',
  })
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date of the product, if deleted',
    example: null,
    nullable: true,
  })
  @IsOptional()
  deletedAt: Date | null;

  @ApiProperty({
    description: 'Additional metadata for the product',
    example: null,
    nullable: true,
  })
  @IsOptional()
  metadata: JsonValue;

  @ApiProperty({ description: 'Stock available for the product', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

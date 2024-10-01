import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password, minimum length 6',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'address_123', description: 'Billing address ID' })
  @IsString()
  billing_address_id: string;
}

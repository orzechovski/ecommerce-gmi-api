import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/regitser-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Prisma } from '@prisma/client';
import { AuthResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(customer: RegisterAuthDto) {
    const {
      first_name,
      last_name,
      email,
      password,
      billing_address_id,
      adminSecretKey,
    } = customer;

    // Sprawdź, czy użytkownik o takim emailu już istnieje
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const correctAdminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (adminSecretKey && adminSecretKey !== correctAdminSecretKey) {
      throw new HttpException('Invalid admin secret key', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        billing_address_id,
        password: hashedPassword,
        role: correctAdminSecretKey === adminSecretKey ? 'ADMIN' : 'USER',
      },
    });
  }

  async login(customer: LoginAuthDto): Promise<AuthResponseDto> {
    const validCustomer = await this.validateCustomer(
      customer.email,
      customer.password,
    );

    if (!validCustomer) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      id: validCustomer.id,
      email: validCustomer.email,
      role: validCustomer.role,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h',
      }),
    };
  }

  async validateCustomer(
    email: string,
    password: string,
  ): Promise<Prisma.CustomerCreateManyInput | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });
    if (customer && (await bcrypt.compare(password, customer.password))) {
      delete customer.metadata;

      return customer;
    }
    return null;
  }
}

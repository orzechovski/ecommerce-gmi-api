import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/regitser-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(customer: RegisterAuthDto) {
    const { first_name, last_name, email, password, billing_address_id } =
      customer;

    // Sprawdź, czy użytkownik o takim emailu już istnieje
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.customer.create({
      data: {
        first_name,
        last_name,
        email,
        billing_address_id,
        password: hashedPassword,
        role: 'USER',
      },
    });
  }

  async login(customer: any) {
    const payload = { email: customer.email, sub: customer.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateCustomer(email: string, password: string): Promise<any> {
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

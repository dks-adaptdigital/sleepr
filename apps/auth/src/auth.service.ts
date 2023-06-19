import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from './users/models/users.schema';
import { ConfigService } from '@nestjs/config';
import { Payload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const payload: Payload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.get<string>('JWT_EXPIRATION')),
    );

    const token = this.jwtService.sign(payload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';// Create this interface to represent the payload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: process.env.JWT_SECRET, // Replace with your actual secret key
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.userId, email: payload.email }; // Return user data from the JWT payload
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/auth.decorator';

/**
 * AuthGuard that validates JWT token and enforces role-based access control.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if user has one of the required roles
    if (roles && !roles.some((role) => decoded.roles?.includes(role))) {
      throw new ForbiddenException('Role not authorized');
    }

    return true;
  }
}

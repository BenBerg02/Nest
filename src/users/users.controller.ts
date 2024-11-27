import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto'
import { GetUser, RoleProtected, auth, getRawHeaders } from './decorators'
import { User } from './entities/user.entity';
import { RoleGuard } from './guards/role/role.guard';
import { validRoles } from './interfaces/valid-roles.interface';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() authUserDto: AuthUserDto) {
    return this.usersService.login(authUserDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser('id') user: User,
    @getRawHeaders() rawHeaders
  ){
    console.log(user)
    return {message: 'yes yes yes', user: user.fullname}
  }

  @Get('checkstatus')
  @auth()
  checkAuthStatus(
    @GetUser() id: User
  ){
    return this.usersService.getStatus(id)
  }
 
  @Get('2')
  @auth(validRoles.admin, validRoles.superAdmin)
  PrivateRoute(
  ){
    return {message: 'yes yes yes'}
  }
}

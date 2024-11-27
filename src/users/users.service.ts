import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      delete user.password

      return {...user, token: this.getJwtToker({id: user.id})}
    } catch (error) {
      this.handleErrors(error)
    }
  }
  async login(authUserDto: AuthUserDto) {
    const { password, email } = authUserDto
    
    const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }})
      

    if (!user) this.handleErrors({code: 20124})

    if (!bcrypt.compareSync(password, user.password)) this.handleErrors(20125)

    return {...user, token: this.getJwtToker({id: user.id})}

  }

  getStatus(user: User){
    return {...user,token: this.getJwtToker({id: user.id})}
  }

  private getJwtToker(payload: JwtPayload){
    return this.jwtService.sign(payload)
  }

  private handleErrors(err): never {
    const code = err.code || err
    switch(code){
      case '23305': throw new BadRequestException('Email is used');
      case 20123: throw new InternalServerErrorException('User Could not be found');
      case 20124: throw new UnauthorizedException('User not found');
      case 20125: throw new UnauthorizedException('password or email failed');
    }

    throw new InternalServerErrorException()
  }

}

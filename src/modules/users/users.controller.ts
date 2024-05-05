import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto } from './dto/user-info.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'update self user info' })
  @ApiOkResponse({
    type: UserInfoDto,
  })
  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    return this.usersService.update(request.user.id, updateUserDto);
  }
}

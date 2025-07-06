import { Controller, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('delete')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Delete a user by ID. Only accessible to admins.
   * @param id User ID
   */
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID to delete' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NoRoles } from 'src/auth/decorators/no-roles.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  RequestUser,
  UserFromRequest,
} from 'src/auth/decorators/user-from-request.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { DecksService } from './deck.service';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import {
  DeckFilter,
  DeckFilterParams,
  HasFilterQueryDeck,
} from 'src/common/filters/deck-filter.params';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  async create(@Body() createDeckDto: CreateDeckDto) {
    return await this.decksService.create(createDeckDto);
  }

  @Get()
  @HasFilterQueryDeck()
  async findAll(@DeckFilter() deckFilter: DeckFilterParams) {
    const decks = await this.decksService.findAll(deckFilter);

    return {
      data: decks,
      meta: {
        total: decks.length,
      },
    };
  }

  @NoRoles()
  @Get('me')
  async findCurrentUserDeck(@UserFromRequest() user: RequestUser) {
    return await this.decksService.findAll({ userId: user.id });
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const deck = await this.decksService.findOne(id);
    return {
      data: deck,
    };
  }

  @Patch('id/:id')
  async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    const updatedDeck = await this.decksService.update(id, updateDeckDto);
    return {
      data: updatedDeck,
    };
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.decksService.delete(id);
  }
}

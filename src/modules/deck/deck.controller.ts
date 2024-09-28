import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
  DeckSelect,
  DeckSelectParams,
  HasSelectQueryDeck,
} from 'src/common/filters/deck/deck-select.params';
import {
  DeckFilter,
  DeckFilterParams,
  HasFilterQueryDeck,
} from 'src/common/filters/deck/deck-filter.params';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(
    private readonly decksService: DecksService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createDeckDto: CreateDeckDto) {
    return await this.decksService.create(createDeckDto);
  }

  @Get('no-cache')
  @HasFilterQueryDeck()
  @HasSelectQueryDeck()
  async findAllWithoutCache(
    @DeckFilter() deckFilter: DeckFilterParams,
    @DeckSelect() deckSelect: DeckSelectParams,
  ) {
    const decks = await this.decksService.findAll(deckFilter, deckSelect);

    const response = {
      data: decks,
      meta: {
        total: decks.length,
      },
    };

    return { ...response, isCached: false };
  }
  @Get()
  @HasFilterQueryDeck()
  @HasSelectQueryDeck()
  async findAll(
    @DeckFilter() deckFilter: DeckFilterParams,
    @DeckSelect() deckSelect: DeckSelectParams,
  ) {
    const cacheKey = `deck_findAll`;

    const cachedData: object = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        isCached: true,
      };
    }

    const decks = await this.decksService.findAll(deckFilter, deckSelect);

    const response = {
      data: decks,
      meta: {
        total: decks.length,
      },
    };

    await this.cacheManager.set(cacheKey, response, 6000);

    return { ...response, isCached: false };
  }

  @NoRoles()
  @HasSelectQueryDeck()
  @Get('me')
  async findCurrentUserDeck(
    @UserFromRequest() user: RequestUser,
    @DeckSelect() deckSelect: DeckSelectParams,
  ) {
    const cacheKey = `user${user.id}_showCards_${deckSelect.showCards}`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return {
        data: cachedData,
        isCached: true,
      };
    }

    const decks = await this.decksService.findAll(
      { userId: user.id },
      deckSelect,
    );

    await this.cacheManager.set(cacheKey, decks, 10000);

    return {
      data: decks,
      isCached: false,
    };
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

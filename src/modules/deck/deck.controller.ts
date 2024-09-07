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
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DecksService } from './deck.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  async create(@Body() createDeckDto: CreateDeckDto) {
    return await this.decksService.create(createDeckDto);
  }

  @Get()
  async findAll() {
    const decks = await this.decksService.findAll();

    return {
      data: decks,
      meta: {
        total: decks.length,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const deck = await this.decksService.findOne(id);
    return {
      data: deck,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    const updatedDeck = await this.decksService.update(id, updateDeckDto);
    return {
      data: updatedDeck,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.decksService.delete(id);
  }
}

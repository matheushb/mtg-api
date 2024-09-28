import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ScyfallGateway } from './scyfall.gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ImportDeckDto } from './dtos/import-deck.dto';
import {
  RequestUser,
  UserFromRequest,
} from 'src/auth/decorators/user-from-request.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Scyfall')
@Controller('scyfall')
export class ScyfallController {
  constructor(private readonly scyfallGateway: ScyfallGateway) {}

  @ApiParam({ name: 'deck_name', required: true })
  @ApiParam({
    name: 'color',
    required: false,
    description: 'Pode conter qualquer conjunto de cores, ex: WR',
  })
  @Get('seed/:deck_name/:color')
  async seed(
    @Request() req,
    @Param('deck_name') deckName: string,
    @Param('color') color?: string,
  ) {
    await this.scyfallGateway.getLeader(
      req.user,
      deckName,
      color !== '{color}' ? color : null,
    );
  }

  @Post('import')
  async import(
    @Body() importDeckDto: ImportDeckDto,
    @UserFromRequest() user: RequestUser,
  ) {
    console.log(importDeckDto);

    await this.scyfallGateway.importDeck(
      user,
      importDeckDto.name,
      importDeckDto.cards,
    );
  }
}

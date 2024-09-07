import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ScyfallGateway } from './scyfall.gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Scyfall')
@Controller('scyfall')
export class ScyfallController {
  constructor(private readonly scyfallGateway: ScyfallGateway) {}

  @ApiParam({ name: 'deck_name', required: true })
  @ApiParam({ name: 'color', required: false, description: 'Opcional' })
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
}

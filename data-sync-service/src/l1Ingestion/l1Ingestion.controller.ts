import { L1IngestionService } from './l1Ingestion.service';
import { L2IngestionService } from '../l2Ingestion/l2Ingestion.service';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { isValidAddress, publicToAddress } from 'ethereumjs-util';

@Controller('/')
export class L1IngestionController {
  constructor(private readonly l1IngestionService: L1IngestionService,
              private readonly L2IngestionService: L2IngestionService,
    ) {}

  @Get('l1tol2')
  getL1ToL2Relation() {
    return this.l1IngestionService.getL1ToL2Relation();
  }
  @Get('l2tol1')
  getL2ToL1Relation() {
    return this.l1IngestionService.getL2ToL1Relation();
  }
  @Post('l1l2_transaction')
  getL1L2Transaction(@Body() param) {
    const address = param['address'];
    if (!isValidAddress(address)) {
      return { ok: false, code: 4000, result: 'invalid address' };
    }
    const page = param['page'];
    const page_size = param['page_size'];
    if (Number(page) <= 0 || Number(page_size) <= 0) {
      return {
        ok: false,
        code: 4000,
        result: 'page and page_size must more than 0',
      };
    }
    if (Number(page_size) > 1000 || Number(page_size) < 5) {
      return {
        ok: false,
        code: 4000,
        result: 'page_size must more than 5 less than 1000',
      };
    }
    const type = param['type'];
    if (Number(type) < 1 || Number(type) > 2) {
      return {
        ok: false,
        code: 4000,
        result: 'invalid transaction type',
      };
    }
    const order_by = param['order_by'];
    if (String(order_by) != 'DESC' && String(order_by) != 'ASC') {
      return {
        ok: false,
        code: 4000,
        result: 'invalid order type',
      };
    }
    return this.l1IngestionService.getL1L2Transaction(
      address,
      page,
      page_size,
      type,
      order_by,
    );
  }
  @Get('deposits/:address')
  getDepositList(@Param('address') address, @Query('offset') offset = 0, @Query('limit') limit = 0) {
    if (!isValidAddress(address)) {
      return { ok: false, code: 4000, result: 'invalid address' };
    }
    return this.l1IngestionService.getDepositList(address, Number(offset), Number(limit));
  }
  @Get('withdrawals/:address')
  getWithdrawList(@Param('address') address, @Query('offset') offset = 0, @Query('limit') limit = 0) {
    if (!isValidAddress(address)) {
      return { ok: false, code: 4000, result: 'invalid address' };
    }
    return this.l1IngestionService.getWithdrawList(address, Number(offset), Number(limit));
  }
}

import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('csrf')
export class CsrfController {
  @Get()
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken()
    res.cookie('XSRF-TOKEN', csrfToken)
    return res.json({ csrfToken })
  }
}

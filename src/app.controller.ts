import { Controller, Get, Post, Body, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScreenshotOptions, ScreenshotService } from './app.service';

@Controller()
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get('/health')
  @HttpCode(200)
  pingStatus(): { status: string } {
    return { status: 'healthy' };
  }

  @Post('/screenshot')
  async getScreenshot(
    @Body() body: ScreenshotOptions,
    @Res() res: Response,
  ): Promise<void> {
    const screenshot = await this.screenshotService.getScreenshot(body);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline');
    res.send(screenshot);
  }
}

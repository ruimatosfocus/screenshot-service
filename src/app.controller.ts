import { Controller, Get, Post, Body, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScreenshotService } from './app.service';

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
    @Body() body: { url: string; width: number; height: number },
    @Res() res: Response,
  ): Promise<void> {
    const screenshot = await this.screenshotService.getScreenshot(
      body.url,
      body.width,
      body.height,
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline');
    res.send(screenshot);
  }
}

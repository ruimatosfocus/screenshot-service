import { Module } from '@nestjs/common';
import { ScreenshotController } from './app.controller';
import { ScreenshotService } from './app.service';

@Module({
  imports: [],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import puppeteer, { PuppeteerLaunchOptions } from 'puppeteer';

@Injectable()
export class ScreenshotService {
 
  public async getScreenshot(url: string, width: number, height: number): Promise<Buffer> {
    console.log('Starting screenshot process for URL:', url);
    console.log('Chrome path:', await puppeteer.executablePath());

    // Base Chrome flags that work everywhere
    const baseArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--disable-web-security',
      '--disable-dev-shm-usage',
      '--allow-insecure-localhost',
      '--in-process-gpu',
      '--ignore-gpu-blocklist',
      '--no-zygote',
      '--disable-software-rasterizer',
      '--headless',
      '--enable-gpu','--disable-gpu-sandbox', '--gl=egl-angle', '--angle=default','--enable-unsafe-webgpu',
      '--enable-gpu-rasterization',
      '--force-color-profile=srgb',
      '--disable-color-correct-rendering=false',
      '--color-profile=srgb',
      '--force-raster-color-profile=srgb',
      '--canvas-oop-rasterization'
    ];

    // Add GPU flags based on environment

    const options: PuppeteerLaunchOptions = {
      headless: true,
      dumpio: true,
      args: baseArgs
    };
        
    // Only set executablePath if running in Docker (when env var is set)
    // if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    //   // options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    // }
    
    console.log('Creating browser with options:', options);
    const browser = await puppeteer.launch(options).catch(err => {
      console.error('Browser launch error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code
      });
      throw err;
    });

    try {
      console.log('LD_LIBRARY_PATH:', process.env.LD_LIBRARY_PATH)
      console.log('DBUS_SESSION_BUS_ADDRESS:', process.env.DBUS_SESSION_BUS_ADDRESS)

      console.log('Creating new page');
      const page = await browser.newPage();

      console.log('Setting viewport');
      await page.setViewport({ 
        width: width || 1920, 
        height: height || 1080, 
        deviceScaleFactor: 2 
      });
      
      console.log('Setting navigation timeout');
      page.setDefaultNavigationTimeout(0);
      
      console.log('Navigating to URL:', url);
      await page.goto(url, {
        waitUntil: ['networkidle0'],
      });
      
      console.log('Page loaded, taking screenshot');
      const imageBuffer = await page.screenshot({ 
        type: 'png', 
        fullPage: true
      });

      console.log('Screenshot taken successfully');
      return Buffer.from(imageBuffer);
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      throw error;
    } finally {
      console.log('Closing browser');
      await browser.close();
    }
  }
}

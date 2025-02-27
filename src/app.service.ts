import { Injectable } from '@nestjs/common';
import puppeteer, { LaunchOptions, PuppeteerLaunchOptions } from 'puppeteer';

@Injectable()
export class ScreenshotService {
 
  public async getScreenshot(url: string, width: number, height: number, flags: string[] = []): Promise<Buffer> {
    console.log('Starting screenshot process for URL:', url);
    console.log('Chrome path:', puppeteer.executablePath());
    // Base Chrome flags that work everywhere
    const baseArgs = [
      '--no-sandbox',                    // Disables the Chrome sandbox for better compatibility in Docker
      '--disable-setuid-sandbox',        // Disables setuid sandbox (used with --no-sandbox)
      '--ignore-certificate-errors',     // Ignores HTTPS/SSL certificate errors
      '--disable-web-security',          // Disables same-origin policy
      '--disable-dev-shm-usage',        // Prevents /dev/shm usage which can cause issues in containerized environments
      '--allow-insecure-localhost',     // Allows invalid certificates for localhost
      '--no-zygote',                    // Disables the zygote process for better container compatibility
      '--headless',                     // Runs Chrome in headless mode (no GUI)
      ...flags
    ];

    const options: LaunchOptions = {
      headless: true,
      dumpio: true,
      args: baseArgs
    };
        
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
      console.log('DISPLAY:', process.env.DISPLAY)

      console.log('Creating new page');
      const page = await browser.newPage();

      console.log('Setting viewport');
      await page.setViewport({ 
        width: width || 1920, 
        height: height || 1080, 
        deviceScaleFactor: 2,  // Reduced from 2 to avoid rendering issues
        hasTouch: false,
        isLandscape: true
      });
      
      console.log('Setting navigation timeout');
      page.setDefaultNavigationTimeout(0);
      
      // Add WebGL debugging
      await page.evaluateOnNewDocument(() => {
        console.log('WebGL Renderer:', (window as any).WebGLRenderingContext?.prototype?.getParameter?.call?.(null, 0x1F01));
        console.log('WebGL Vendor:', (window as any).WebGLRenderingContext?.prototype?.getParameter?.call?.(null, 0x1F00));
      });
      
      console.log('Navigating to URL:', url);
      await page.goto(url, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      });
      
      // Wait a bit for WebGL content to fully render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Page loaded, taking screenshot');
      const imageBuffer = await page.screenshot({ 
        type: 'png', 
        omitBackground: true,
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

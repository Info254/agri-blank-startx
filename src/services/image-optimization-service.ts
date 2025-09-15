interface OptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
}

interface OptimizedImage {
  blob: Blob;
  url: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export class ImageOptimizationService {
  private static instance: ImageOptimizationService;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService();
    }
    return ImageOptimizationService.instance;
  }

  async optimizeImage(file: File, options: OptimizationOptions = {}): Promise<OptimizedImage> {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'webp'
    } = options;

    try {
      // Load image
      const img = await this.loadImage(file);
      
      // Calculate new dimensions
      const { width, height } = this.calculateDimensions(
        img.width, 
        img.height, 
        maxWidth, 
        maxHeight
      );

      // Resize and compress
      this.canvas.width = width;
      this.canvas.height = height;

      // Apply image smoothing for better quality
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      // Draw resized image
      this.ctx.drawImage(img, 0, 0, width, height);

      // Convert to optimized format
      const mimeType = this.getMimeType(format);
      const blob = await this.canvasToBlob(mimeType, quality);

      const optimizedUrl = URL.createObjectURL(blob);
      
      return {
        blob,
        url: optimizedUrl,
        originalSize: file.size,
        optimizedSize: blob.size,
        compressionRatio: ((file.size - blob.size) / file.size) * 100,
        width,
        height
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  async createThumbnail(file: File, size: number = 150): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: 'webp'
    });
  }

  async createResponsiveImages(file: File): Promise<{
    thumbnail: OptimizedImage;
    small: OptimizedImage;
    medium: OptimizedImage;
    large: OptimizedImage;
  }> {
    const [thumbnail, small, medium, large] = await Promise.all([
      this.optimizeImage(file, { maxWidth: 150, maxHeight: 150, quality: 0.7 }),
      this.optimizeImage(file, { maxWidth: 480, maxHeight: 320, quality: 0.8 }),
      this.optimizeImage(file, { maxWidth: 768, maxHeight: 512, quality: 0.85 }),
      this.optimizeImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.9 })
    ]);

    return { thumbnail, small, medium, large };
  }

  async compressForUpload(file: File, maxSizeKB: number = 500): Promise<OptimizedImage> {
    let quality = 0.9;
    let optimized = await this.optimizeImage(file, { quality });

    // Iteratively reduce quality until under size limit
    while (optimized.optimizedSize > maxSizeKB * 1024 && quality > 0.1) {
      quality -= 0.1;
      optimized = await this.optimizeImage(file, { quality });
    }

    return optimized;
  }

  async convertFormat(file: File, targetFormat: 'webp' | 'jpeg' | 'png'): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      format: targetFormat,
      quality: targetFormat === 'png' ? 1.0 : 0.9
    });
  }

  async addWatermark(file: File, watermarkText: string): Promise<OptimizedImage> {
    const img = await this.loadImage(file);
    
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    
    // Draw original image
    this.ctx.drawImage(img, 0, 0);
    
    // Add watermark
    this.ctx.font = `${Math.max(16, img.width / 40)}px Arial`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';
    
    const x = img.width - 20;
    const y = img.height - 20;
    
    this.ctx.strokeText(watermarkText, x, y);
    this.ctx.fillText(watermarkText, x, y);
    
    const blob = await this.canvasToBlob('image/webp', 0.9);
    
    return {
      blob,
      url: URL.createObjectURL(blob),
      originalSize: file.size,
      optimizedSize: blob.size,
      compressionRatio: ((file.size - blob.size) / file.size) * 100,
      width: img.width,
      height: img.height
    };
  }

  async cropImage(
    file: File, 
    cropArea: { x: number; y: number; width: number; height: number }
  ): Promise<OptimizedImage> {
    const img = await this.loadImage(file);
    
    this.canvas.width = cropArea.width;
    this.canvas.height = cropArea.height;
    
    this.ctx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );
    
    const blob = await this.canvasToBlob('image/webp', 0.9);
    
    return {
      blob,
      url: URL.createObjectURL(blob),
      originalSize: file.size,
      optimizedSize: blob.size,
      compressionRatio: ((file.size - blob.size) / file.size) * 100,
      width: cropArea.width,
      height: cropArea.height
    };
  }

  async enhanceImage(file: File): Promise<OptimizedImage> {
    const img = await this.loadImage(file);
    
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    
    // Draw image
    this.ctx.drawImage(img, 0, 0);
    
    // Get image data for processing
    const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    
    // Apply basic enhancement (brightness and contrast)
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast and brightness slightly
      data[i] = Math.min(255, data[i] * 1.1 + 10);     // Red
      data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 10); // Green
      data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10); // Blue
    }
    
    // Put enhanced image data back
    this.ctx.putImageData(imageData, 0, 0);
    
    const blob = await this.canvasToBlob('image/webp', 0.9);
    
    return {
      blob,
      url: URL.createObjectURL(blob),
      originalSize: file.size,
      optimizedSize: blob.size,
      compressionRatio: ((file.size - blob.size) / file.size) * 100,
      width: img.width,
      height: img.height
    };
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Calculate scaling factor
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

    width = Math.round(width * scale);
    height = Math.round(height * scale);

    return { width, height };
  }

  private getMimeType(format: string): string {
    const mimeTypes = {
      'webp': 'image/webp',
      'jpeg': 'image/jpeg',
      'png': 'image/png'
    };
    return mimeTypes[format as keyof typeof mimeTypes] || 'image/webp';
  }

  private canvasToBlob(mimeType: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        mimeType,
        quality
      );
    });
  }

  // Utility method to check if WebP is supported
  static supportsWebP(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Batch optimization for multiple images
  async optimizeBatch(
    files: File[],
    options: OptimizationOptions = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<OptimizedImage[]> {
    const results: OptimizedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const optimized = await this.optimizeImage(files[i], options);
        results.push(optimized);
        onProgress?.(i + 1, files.length);
      } catch (error) {
        console.error(`Failed to optimize image ${i}:`, error);
        // Continue with other images
      }
    }
    
    return results;
  }

  // Clean up object URLs to prevent memory leaks
  static revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Get image metadata
  async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    aspectRatio: number;
  }> {
    const img = await this.loadImage(file);
    
    return {
      width: img.width,
      height: img.height,
      size: file.size,
      type: file.type,
      aspectRatio: img.width / img.height
    };
  }
}

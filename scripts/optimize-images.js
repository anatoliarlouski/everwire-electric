#!/usr/bin/env node

/**
 * Image Optimization Script
 * Compresses and optimizes images in the public/projects directory
 * Converts to WebP format while maintaining quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/projects');
const OUTPUT_DIR = path.join(__dirname, '../public/projects-optimized');
const BACKUP_DIR = path.join(__dirname, '../public/projects-backup');

// Optimization settings
const OPTIMIZATION_CONFIG = {
  jpeg: {
    quality: 80,
    progressive: true,
    mozjpeg: true,
  },
  webp: {
    quality: 80,
    effort: 6,
  },
  resize: {
    maxWidth: 1920,
    maxHeight: 1920,
    fit: 'inside',
    withoutEnlargement: true,
  },
};

/**
 * Get file size in human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputPath, filename) {
  try {
    const inputStats = fs.statSync(inputPath);
    const inputSize = inputStats.size;

    // Process image with sharp
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Processing: ${filename} (${formatBytes(inputSize)})`);

    // Resize if needed
    let pipeline = image;
    if (metadata.width > OPTIMIZATION_CONFIG.resize.maxWidth || 
        metadata.height > OPTIMIZATION_CONFIG.resize.maxHeight) {
      pipeline = pipeline.resize(OPTIMIZATION_CONFIG.resize);
      console.log(`  - Resizing from ${metadata.width}x${metadata.height}`);
    }

    // Save optimized JPEG
    const jpegPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.jpg');
    await pipeline
      .jpeg(OPTIMIZATION_CONFIG.jpeg)
      .toFile(jpegPath);

    // Save WebP version
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharp(inputPath)
      .resize(OPTIMIZATION_CONFIG.resize)
      .webp(OPTIMIZATION_CONFIG.webp)
      .toFile(webpPath);

    const jpegStats = fs.statSync(jpegPath);
    const webpStats = fs.statSync(webpPath);
    const jpegSize = jpegStats.size;
    const webpSize = webpStats.size;

    const jpegSavings = ((inputSize - jpegSize) / inputSize * 100).toFixed(1);
    const webpSavings = ((inputSize - webpSize) / inputSize * 100).toFixed(1);

    console.log(`  ✓ JPEG: ${formatBytes(jpegSize)} (${jpegSavings}% smaller)`);
    console.log(`  ✓ WebP: ${formatBytes(webpSize)} (${webpSavings}% smaller)`);

    return {
      filename,
      originalSize: inputSize,
      jpegSize,
      webpSize,
      jpegSavings: parseFloat(jpegSavings),
      webpSavings: parseFloat(webpSavings),
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
    return null;
  }
}

/**
 * Main optimization function
 */
async function optimizeAllImages() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('═'.repeat(60));

  // Create directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(INPUT_DIR).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  if (files.length === 0) {
    console.log('No images found in', INPUT_DIR);
    return;
  }

  console.log(`Found ${files.length} images to optimize\n`);

  const results = [];
  let totalOriginalSize = 0;
  let totalJpegSize = 0;
  let totalWebpSize = 0;

  // Process each image
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    
    const result = await optimizeImage(inputPath, outputPath, file);
    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalJpegSize += result.jpegSize;
      totalWebpSize += result.webpSize;
    }
    console.log('');
  }

  // Print summary
  console.log('═'.repeat(60));
  console.log('\n📊 Optimization Summary\n');
  console.log(`Total images processed: ${results.length}`);
  console.log(`Original total size: ${formatBytes(totalOriginalSize)}`);
  console.log(`JPEG total size: ${formatBytes(totalJpegSize)} (${((totalOriginalSize - totalJpegSize) / totalOriginalSize * 100).toFixed(1)}% smaller)`);
  console.log(`WebP total size: ${formatBytes(totalWebpSize)} (${((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1)}% smaller)`);
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
  console.log('\n✅ Optimization complete!');
  console.log('\n💡 Next steps:');
  console.log('1. Review the optimized images in projects-optimized/');
  console.log('2. If satisfied, run: npm run images:replace');
  console.log('3. Original images will be backed up to projects-backup/');
}

// Run the optimization
optimizeAllImages().catch(console.error);

#!/usr/bin/env node

/**
 * Replace Images Script
 * Backs up original images and replaces them with optimized versions
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/projects');
const OPTIMIZED_DIR = path.join(__dirname, '../public/projects-optimized');
const BACKUP_DIR = path.join(__dirname, '../public/projects-backup');

/**
 * Main replacement function
 */
function replaceImages() {
  console.log('🔄 Replacing images with optimized versions\n');
  console.log('═'.repeat(60));

  // Check if optimized directory exists
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    console.error('❌ Error: Optimized images directory not found!');
    console.log('Please run: npm run images:optimize first');
    process.exit(1);
  }

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Get all files from input directory
  const files = fs.readdirSync(INPUT_DIR).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  console.log(`Backing up ${files.length} original images...\n`);

  // Backup original files
  for (const file of files) {
    const sourcePath = path.join(INPUT_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    
    try {
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`✓ Backed up: ${file}`);
    } catch (error) {
      console.error(`✗ Error backing up ${file}:`, error.message);
    }
  }

  console.log('\n' + '─'.repeat(60) + '\n');
  console.log('Replacing with optimized images...\n');

  // Copy optimized files
  const optimizedFiles = fs.readdirSync(OPTIMIZED_DIR);
  let replacedCount = 0;

  for (const file of optimizedFiles) {
    const sourcePath = path.join(OPTIMIZED_DIR, file);
    const destPath = path.join(INPUT_DIR, file);
    
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✓ Replaced: ${file}`);
      replacedCount++;
    } catch (error) {
      console.error(`✗ Error replacing ${file}:`, error.message);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n✅ Successfully replaced ${replacedCount} images!`);
  console.log(`\nOriginal images backed up to: ${BACKUP_DIR}`);
  console.log('Optimized images are now in: ' + INPUT_DIR);
  console.log('\n💡 You can now delete the projects-optimized/ directory');
}

// Run the replacement
replaceImages();

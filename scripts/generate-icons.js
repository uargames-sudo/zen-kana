import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create uncompressed PNG buffer
function createMinimalPNG(width, height, r = 0x38, g = 0x65, b = 0x6f) {
  // A raw PNG chunk builder
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type 2 (RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = makeChunk('IHDR', ihdr);
  
  // IDAT - raw RGB uncompressed scanlines with filter byte 0
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }
  
  // Minimal zlib wrapper around raw scanline data
  const zlibHeader = Buffer.from([0x78, 0x01]);
  // Adler32 checksum calculation
  let s1 = 1, s2 = 0;
  for (let i = 0; i < rawData.length; i++) {
    s1 = (s1 + rawData[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE(((s2 << 16) | s1) >>> 0, 0);
  
  // Stored blocks (non-compressed zlib blocks)
  const maxBlock = 65535;
  const blocks = [];
  for (let offset = 0; offset < rawData.length; offset += maxBlock) {
    const end = Math.min(offset + maxBlock, rawData.length);
    const len = end - offset;
    const isLast = end === rawData.length ? 1 : 0;
    const header = Buffer.alloc(5);
    header.writeUInt8(isLast, 0);
    header.writeUInt16LE(len, 1);
    header.writeUInt16LE(~len & 0xFFFF, 3);
    blocks.push(header, rawData.subarray(offset, end));
  }
  
  const idatContent = Buffer.concat([zlibHeader, ...blocks, adler]);
  const idatChunk = makeChunk('IDAT', idatContent);
  
  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// CRC32 implementation for PNG chunks
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const icon192 = createMinimalPNG(192, 192);
const icon512 = createMinimalPNG(512, 512);
fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
console.log('Successfully generated PNG icons in public directory!');

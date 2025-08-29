import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BuildInfoService {
  private buildTimestamp: number;

  constructor() {
    this.buildTimestamp = this.getBuildTimestamp();
  }

  /**
   * Get build timestamp from dist directory creation time
   * Falls back to current time if dist doesn't exist
   */
  private getBuildTimestamp(): number {
    try {
      // Check if dist directory exists (production build)
      const distPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distPath)) {
        const stats = fs.statSync(distPath);
        return stats.mtime.getTime();
      }
      
      // Fallback: check if main.js exists in dist
      const mainJsPath = path.join(process.cwd(), 'dist', 'main.js');
      if (fs.existsSync(mainJsPath)) {
        const stats = fs.statSync(mainJsPath);
        return stats.mtime.getTime();
      }
      
      // Development mode or no build found
      return Date.now();
    } catch (error) {
      // Fallback to current time if any error occurs
      return Date.now();
    }
  }

  /**
   * Get build timestamp
   */
  getBuildAt(): number {
    return this.buildTimestamp;
  }

  /**
   * Get current process ID
   */
  getProcessId(): number {
    return process.pid;
  }

  /**
   * Get runtime info including build time and process ID
   */
  getRuntimeInfo() {
    return {
      buildAt: this.getBuildAt(),
      processId: this.getProcessId(),
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
    };
  }
}
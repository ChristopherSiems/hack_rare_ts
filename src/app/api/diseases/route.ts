// File: app/api/diseases/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Read the disease.txt file from the utils directory
    const filePath = path.join(process.cwd(), 'utils', 'disease.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Split the content by newlines and remove empty lines
    const diseases = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    // Return the diseases as JSON
    return NextResponse.json({ 
      diseases,
      count: diseases.length,
      success: true 
    });
  } catch (error) {
    console.error('Error reading disease.txt:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load diseases', 
        success: false 
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Read the currentUsers.txt file from the utils directory
    const filePath = path.join(process.cwd(), 'utils', 'chatters.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Split the content by newlines and remove empty lines
    const chatters = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    // Return the chatters as JSON
    return NextResponse.json({ 
      chatters,
      count: chatters.length,
      success: true 
    });
  } catch (error) {
    console.error('Error reading currentUsers.txt:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load current users', 
        success: false 
      },
      { status: 500 }
    );
  }
}
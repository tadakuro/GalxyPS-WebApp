import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('servers');
    const server = await collection.findOne({ _id: 'main-server' } as any);

    if (!server || !server.hostFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return new NextResponse(server.hostFile, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
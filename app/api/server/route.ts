import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('servers');
    const server = await collection.findOne({ _id: 'main-server' });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch server' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { INITIAL_GIGS } from '../../../lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campus = searchParams.get('campus');
  const category = searchParams.get('category');

  let gigs = [...INITIAL_GIGS];

  if (campus && campus !== 'ALL') {
    gigs = gigs.filter((g) => g.campus === 'ALL' || g.campus === campus);
  }

  if (category && category !== 'ALL') {
    gigs = gigs.filter((g) => g.category === category);
  }

  return NextResponse.json({
    count: gigs.length,
    gigs,
  });
}

export async function POST(request: Request) {
  try {
    const gigData = await request.json();
    const newGig = {
      id: `gig-${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicantCount: 0,
      escrowStatus: 'HELD',
      ...gigData,
    };

    return NextResponse.json({ success: true, gig: newGig }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 400 });
  }
}

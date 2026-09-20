import { NextResponse } from 'next/server';
import { INITIAL_FINANCIAL_LOGS } from '../../../lib/mockData';

export async function GET() {
  return NextResponse.json({
    count: INITIAL_FINANCIAL_LOGS.length,
    logs: INITIAL_FINANCIAL_LOGS,
  });
}

export async function POST(request: Request) {
  try {
    const logData = await request.json();
    const newLog = {
      id: `fin-${Date.now()}`,
      userId: 'usr-mmu-04289',
      loggedAt: new Date().toISOString(),
      ...logData,
    };

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record financial transaction' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = parseInt(searchParams.get('offset') || '0');
    const categoryId = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = await getProducts(
      { categoryId, search },
      { limit, offset }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

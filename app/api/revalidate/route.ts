import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  if (req.headers.get('x-secret') !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { tag } = await req.json();
  revalidateTag(tag || 'upcoming', 'default');
  return Response.json({ ok: true });
}

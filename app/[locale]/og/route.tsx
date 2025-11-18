import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Season Track';
  const subtitle = searchParams.get('subtitle') ?? '';
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b0b0c, #1a1a1d)'
        }}
      >
        <div style={{ fontSize: 60, color: 'white', fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ marginTop: 16, fontSize: 30, color: '#b9b29c' }}>{subtitle}</div>}
        <div style={{ position: 'absolute', bottom: 40, right: 60, color: '#c6b68a' }}>seasontrack.app</div>
      </div>
    ),
    { ...size }
  );
}

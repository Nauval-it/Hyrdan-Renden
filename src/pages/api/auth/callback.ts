import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect, session }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/api/auth/login');
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: import.meta.env.GITHUB_CLIENT_ID,
      client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response('Login failed', { status: 401 });
  }

  session.set('github_token', tokenData.access_token);

  return redirect('/admin');
};
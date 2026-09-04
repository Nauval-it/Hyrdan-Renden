import type { APIRoute } from 'astro';
import yaml from 'js-yaml';

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export const POST: APIRoute = async ({ request, session }) => {
  const token = session?.get('github_token');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const body = await request.json();
  const { lang, slug, title, date, category, coverImage, excerpt, tags, author, blocks } = body;

  if (!lang || !slug || !title) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const frontmatter = yaml.dump({ title, date, category, coverImage, excerpt, lang, tags, author, blocks });
  const markdownContent = `---\n${frontmatter}---\n`;

  const repo = import.meta.env.GITHUB_REPO;
  const path = `src/content/articles/${lang}/${slug}.md`;

  const existingRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });

  let sha: string | undefined;
  if (existingRes.ok) {
    const existingData = await existingRes.json();
    sha = existingData.sha;
  }

  const commitRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: sha ? `Update article: ${title}` : `Create article: ${title}`,
      content: toBase64(markdownContent),
      branch: 'main',
      ...(sha ? { sha } : {}),
    }),
  });

  if (!commitRes.ok) {
    const detail = await commitRes.text();
    return new Response(JSON.stringify({ error: 'Failed to save to GitHub', detail }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
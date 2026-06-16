/**
 * Admin API for viewing form submissions
 * GET /api/submissions — list all submissions
 * GET /api/submissions?id=X — get single submission with files
 */

import { Env } from './contact';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  // Simple auth check via query param (for now — can be enhanced with JWT/session)
  const authToken = url.searchParams.get('token');
  const expectedToken = env.ADMIN_TOKEN;

  // If ADMIN_TOKEN is set, require it
  if (expectedToken && authToken !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (id) {
      // Get single submission with files
      const submission = await env.visa2au_db.prepare(
        `SELECT * FROM submissions WHERE id = ?`
      ).bind(id).first();

      if (!submission) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const files = await env.visa2au_db.prepare(
        `SELECT * FROM submission_files WHERE submission_id = ? ORDER BY created_at`
      ).bind(id).all();

      return new Response(JSON.stringify({
        submission,
        files: files.results || [],
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // List all submissions (with file count)
    const result = await env.visa2au_db.prepare(
      `SELECT
        s.*,
        COUNT(f.id) as file_count
       FROM submissions s
       LEFT JOIN submission_files f ON s.id = f.submission_id
       GROUP BY s.id
       ORDER BY s.created_at DESC
       LIMIT 100`
    ).all();

    return new Response(JSON.stringify({
      submissions: result.results || [],
      total: result.results?.length || 0,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Submissions API error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PATCH to update submission status
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const authToken = url.searchParams.get('token');
  const expectedToken = env.ADMIN_TOKEN;

  if (expectedToken && authToken !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json() as { status?: string };
    const validStatuses = ['new', 'read', 'replied', 'archived'];

    if (!body.status || !validStatuses.includes(body.status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.visa2au_db.prepare(
      `UPDATE submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(body.status, id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

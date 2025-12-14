export const prerender = false;

import type { APIRoute } from 'astro';
import { toISODate } from '../../../../lib/dates';
import { getEntryValue } from '../../../../lib/db';

async function getUserId(locals: any): Promise<string | null> {
  const authFn = locals?.auth;
  if (typeof authFn !== 'function') return null;
  const authResult = await authFn();
  return authResult?.userId ?? null;
}

export const GET: APIRoute = async ({ locals }) => {
  const userId = await getUserId(locals);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const today = toISODate(new Date());
    const value = await getEntryValue((locals as any)?.runtime?.env, userId, today);
    return new Response(JSON.stringify({ value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

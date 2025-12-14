export const prerender = false;

import type { APIRoute } from 'astro';
import { isoDateDaysAgo, toISODate } from '../../../lib/dates';
import { listEntriesSince, upsertEntry } from '../../../lib/db';

async function getUserId(locals: any): Promise<string | null> {
  const authFn = locals?.auth;
  if (typeof authFn !== 'function') return null;
  const authResult = await authFn();
  return authResult?.userId ?? null;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const userId = await getUserId(locals);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const daysRaw = url.searchParams.get('days') ?? '30';
  const days = Number.parseInt(daysRaw, 10);

  if (![7, 30, 365].includes(days)) {
    return new Response(JSON.stringify({ error: 'Invalid days' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const startDate = isoDateDaysAgo(days);
    const rows = await listEntriesSince((locals as any)?.runtime?.env, userId, startDate);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch entries' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const userId = await getUserId(locals);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const value = body?.value;
  if (typeof value !== 'number' || value < 0 || value > 100) {
    return new Response(JSON.stringify({ error: 'Invalid value' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const today = toISODate(new Date());

  try {
    await upsertEntry((locals as any)?.runtime?.env, userId, today, value);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to save entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

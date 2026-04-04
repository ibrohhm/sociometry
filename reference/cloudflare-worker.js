export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...corsHeaders, 'Access-Control-Max-Age': '86400' },
      });
    }

    if (request.method === 'GET' && url.pathname === '/api/questions') {
      const { results } = await env.sociometryDB.prepare(
        'SELECT * FROM questions'
      ).all();

      return Response.json(results, { headers: corsHeaders });
    }

    if (request.method === 'GET' && url.pathname === '/api/users') {
      const email = url.searchParams.get('email');

      if (!email) {
        return Response.json({ error: 'Email parameter is required' }, { status: 400, headers: corsHeaders });
      }

      const result = await env.sociometryDB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first();

      if (!result) {
        return Response.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
      }

      return Response.json(result, { headers: corsHeaders });
    }

    if (request.method === 'GET' && url.pathname === '/api/teams') {
      const facilitatorId = url.searchParams.get('facilitator_id');

      if (!facilitatorId) {
        return Response.json({ error: 'facilitator_id parameter is required' }, { status: 400, headers: corsHeaders });
      }

      const { results } = await env.sociometryDB.prepare(
        'SELECT t.id as team_id, t.name as team_name, t.pin, m.id, m.name, m.submitted FROM teams t LEFT JOIN members m ON m.team_id = t.id WHERE t.facilitator_id = ?'
      ).bind(facilitatorId).all();

      const map = new Map();
      for (const row of results) {
        if (!map.has(row.team_id)) {
          map.set(row.team_id, { id: row.team_id, name: row.team_name, pin: row.pin, members: [] });
        }
        if (row.id) {
          map.get(row.team_id).members.push({ id: row.id, name: row.name, submitted: row.submitted === 1 });
        }
      }

      return Response.json(Array.from(map.values()), { headers: corsHeaders });
    }

    if (request.method === 'POST' && url.pathname === '/api/teams') {
      const body = await request.json();
      const { name, pin, facilitator_id, members } = body;

      if (!name || !pin || !facilitator_id || !Array.isArray(members) || members.length === 0) {
        return Response.json({ error: 'name, pin, facilitator_id, and members are required' }, { status: 400, headers: corsHeaders });
      }

      if (members.some((m) => !m.name || typeof m.name !== 'string' || !m.name.trim())) {
        return Response.json({ error: 'Each member must have a name' }, { status: 400, headers: corsHeaders });
      }

      const team = await env.sociometryDB.prepare(
        'INSERT INTO teams (name, pin, facilitator_id) VALUES (?, ?, ?) RETURNING *'
      ).bind(name, pin, facilitator_id).first();

      await env.sociometryDB.batch(
        members.map((member) =>
          env.sociometryDB.prepare(
            'INSERT INTO members (name, team_id, submitted) VALUES (?, ?, ?)'
          ).bind(member.name, team.id, member.submitted ? 1 : 0)
        )
      );

      return Response.json({ ...team, members }, { status: 201, headers: corsHeaders });
    }

    if (request.method === 'PUT' && url.pathname.startsWith('/api/teams/')) {
      const id = url.pathname.split('/').at(-1);
      const body = await request.json();
      const { name, pin, members } = body;

      if (!name || !pin || !Array.isArray(members) || members.length === 0) {
        return Response.json({ error: 'name, pin, and members are required' }, { status: 400, headers: corsHeaders });
      }

      const existing = await env.sociometryDB.prepare(
        'SELECT id FROM teams WHERE id = ?'
      ).bind(id).first();

      if (!existing) {
        return Response.json({ error: 'Team not found' }, { status: 404, headers: corsHeaders });
      }

      const { results: existingMembers } = await env.sociometryDB.prepare(
        'SELECT name FROM members WHERE team_id = ? AND submitted = 1'
      ).bind(id).all();

      if (existingMembers.length > 0) {
        const names = existingMembers.map((m) => m.name).join(', ');
        return Response.json({ error: `Cannot edit team: ${names} has already submitted` }, { status: 409, headers: corsHeaders });
      }

      await env.sociometryDB.prepare(
        'UPDATE teams SET name = ?, pin = ? WHERE id = ?'
      ).bind(name, pin, id).run();

      await env.sociometryDB.prepare(
        'DELETE FROM members WHERE team_id = ?'
      ).bind(id).run();

      await env.sociometryDB.batch(
        members.map((member) =>
          env.sociometryDB.prepare(
            'INSERT INTO members (name, team_id, submitted) VALUES (?, ?, ?)'
          ).bind(member.name, id, member.submitted ? 1 : 0)
        )
      );

      const { results } = await env.sociometryDB.prepare(
        'SELECT t.id as team_id, t.name as team_name, t.pin, m.id, m.name, m.submitted FROM teams t LEFT JOIN members m ON m.team_id = t.id WHERE t.id = ?'
      ).bind(id).all();

      const first = results[0];
      const updated = { id: first.team_id, name: first.team_name, pin: first.pin, members: [] };
      for (const row of results) {
        if (row.id) {
          updated.members.push({ id: row.id, name: row.name, submitted: row.submitted === 1 });
        }
      }

      return Response.json(updated, { headers: corsHeaders });
    }

    if (request.method === 'GET' && url.pathname.startsWith('/api/teams/')) {
      const pin = url.pathname.split('/').at(-1);

      const { results } = await env.sociometryDB.prepare(
        'SELECT t.id as team_id, t.name as team_name, t.pin, m.id, m.name, m.submitted FROM teams t LEFT JOIN members m ON m.team_id = t.id WHERE t.pin = ?'
      ).bind(pin).all();

      if (results.length === 0) {
        return Response.json({ error: 'Team not found' }, { status: 404, headers: corsHeaders });
      }

      const first = results[0];
      const team = { id: first.team_id, name: first.team_name, pin: first.pin, members: [] };
      for (const row of results) {
        if (row.id) {
          team.members.push({ id: row.id, name: row.name, submitted: row.submitted === 1 });
        }
      }

      return Response.json(team, { headers: corsHeaders });
    }

    if (request.method === 'POST' && url.pathname === '/api/survey/submit') {
      const body = await request.json();
      const { submitter_id, nominations } = body;

      if (!submitter_id || !Array.isArray(nominations) || nominations.length === 0) {
        return Response.json({ error: 'submitter_id and nominations are required' }, { status: 400, headers: corsHeaders });
      }

      if (nominations.some((n) => !n.question_id || !n.nominee_id)) {
        return Response.json({ error: 'Each nomination must have question_id and nominee_id' }, { status: 400, headers: corsHeaders });
      }

      const nomineeIds = [...new Set(nominations.map((n) => n.nominee_id))];
      const allIds = [submitter_id, ...nomineeIds];
      const placeholders = allIds.map(() => '?').join(', ');

      const { results } = await env.sociometryDB.prepare(
        `SELECT id, team_id, submitted FROM members WHERE id IN (${placeholders})`
      ).bind(...allIds).all();

      const member = results.find((r) => r.id === submitter_id);
      if (!member) {
        return Response.json({ error: 'Member not found' }, { status: 404, headers: corsHeaders });
      }

      if (member.submitted === 1) {
        return Response.json({ error: 'Member has already submitted' }, { status: 409, headers: corsHeaders });
      }

      const allSameTeam = results.every((r) => r.team_id === member.team_id);
      if (!allSameTeam) {
        return Response.json({ error: 'All nominees must belong to the same team' }, { status: 400, headers: corsHeaders });
      }

      try {
        await env.sociometryDB.batch([
          ...nominations.map((n) =>
            env.sociometryDB.prepare(
              'INSERT INTO nominations (submitter_id, question_id, nominee_id) VALUES (?, ?, ?)'
            ).bind(submitter_id, n.question_id, n.nominee_id)
          ),
          env.sociometryDB.prepare(
            'UPDATE members SET submitted = 1 WHERE id = ?'
          ).bind(submitter_id),
        ]);
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
      }

      return Response.json({ success: true }, { status: 200, headers: corsHeaders });
    }

    const nominationsMatch = /^\/api\/teams\/(\d+)\/nominations$/.exec(url.pathname);
    if (request.method === 'GET' && nominationsMatch) {
      const teamId = Number.parseInt(nominationsMatch[1]);

      const { results: members } = await env.sociometryDB.prepare(
        'SELECT id, submitted FROM members WHERE team_id = ?'
      ).bind(teamId).all();

      if (members.length === 0) {
        return Response.json({ error: 'Team not found' }, { status: 404, headers: corsHeaders });
      }

      const notSubmitted = members.filter((m) => m.submitted !== 1);
      if (notSubmitted.length > 0) {
        return Response.json(
          { error: 'Not all members have submitted', pending: notSubmitted.map((m) => m.id) },
          { status: 400, headers: corsHeaders }
        );
      }

      const { results } = await env.sociometryDB.prepare(
        `SELECT t.name as team_name, m.name as submitter, q.category, q.valence, q.question, nominee.name as nominee_name
         FROM teams t
         LEFT JOIN members m ON m.team_id = t.id
         LEFT JOIN nominations n ON n.submitter_id = m.id
         LEFT JOIN questions q ON q.id = n.question_id
         LEFT JOIN members nominee ON nominee.id = n.nominee_id
         WHERE t.id = ?`
      ).bind(teamId).all();

      return Response.json(results, { headers: corsHeaders });
    }

    return Response.json({ error: 'Not Found' }, { status: 404, headers: corsHeaders });
  },
};

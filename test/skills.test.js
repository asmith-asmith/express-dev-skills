const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server, base;

before(() => new Promise(resolve => {
  server = app.listen(0, () => {
    base = `http://localhost:${server.address().port}`;
    resolve();
  });
}));

after(() => server.close());

function form(path, body) {
  return fetch(base + path, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
    redirect: 'manual',
  });
}

test('pages render', async () => {
  for (const path of ['/', '/skills', '/skills/new', '/skills/1', '/skills/1/edit']) {
    assert.strictEqual((await fetch(base + path)).status, 200, path);
  }
});

test('unknown skill returns 404', async () => {
  assert.strictEqual((await fetch(base + '/skills/999')).status, 404);
  assert.strictEqual((await fetch(base + '/skills/999/edit')).status, 404);
  assert.strictEqual((await form('/skills/999?_method=PUT', { skill: 'x' })).status, 404);
  assert.strictEqual((await form('/skills/999?_method=DELETE', {})).status, 404);
});

test('create, update, and delete a skill', async () => {
  let res = await form('/skills', { skill: 'Node' });
  assert.strictEqual(res.status, 302);
  assert.match(await (await fetch(base + '/skills')).text(), /Node/);

  res = await form('/skills/4?_method=PUT', { skill: 'Express', id: '1' });
  assert.strictEqual(res.status, 302);
  assert.strictEqual(res.headers.get('location'), '/skills/4');
  assert.match(await (await fetch(base + '/skills/4')).text(), /Express/);

  res = await form('/skills/4?_method=DELETE', {});
  assert.strictEqual(res.status, 302);
  assert.strictEqual((await fetch(base + '/skills/4')).status, 404);
  // the other skills must still be there
  assert.strictEqual((await fetch(base + '/skills/3')).status, 200);
});

test('ids stay unique after a delete', async () => {
  await form('/skills/1?_method=DELETE', {});
  await form('/skills', { skill: 'A' });
  await form('/skills', { skill: 'B' });
  const html = await (await fetch(base + '/skills')).text();
  const ids = [...html.matchAll(/href="\/skills\/(\d+)"/g)].map(m => m[1]);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test('empty name is not saved', async () => {
  const before = (await (await fetch(base + '/skills')).text()).match(/<li>/g).length;
  await form('/skills', { skill: '   ' });
  const after = (await (await fetch(base + '/skills')).text()).match(/<li>/g).length;
  assert.strictEqual(after, before);
});

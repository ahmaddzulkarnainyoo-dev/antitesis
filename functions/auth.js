const CLIENT_ID = globalThis.GITHUB_CLIENT_ID;
const CLIENT_SECRET = globalThis.GITHUB_CLIENT_SECRET;

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/auth', '');

  // Step 1: redirect to GitHub
  if (path === '' || path === '/') {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: 'repo,user',
      redirect_uri: `${url.origin}/auth/callback`,
    });
    return Response.redirect(
      `https://github.com/login/oauth/authorize?${params}`, 302
    );
  }

  // Step 2: callback — exchange code for token
  if (path === '/callback') {
    const code = url.searchParams.get('code');
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const { access_token, error } = await tokenRes.json();
    if (error || !access_token) {
      return new Response(`Auth error: ${error}`, { status: 400 });
    }
    const html = `<!DOCTYPE html><html><body><script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: access_token, provider: 'github' }).replace(/"/g, '\\"')}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response('Not found', { status: 404 });
}

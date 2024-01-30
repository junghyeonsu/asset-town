const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export function handleOptions(request: Request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  const origin = request.headers.get("Origin");
  const method = request.headers.get("Access-Control-Request-Method");
  const headers = request.headers.get("Access-Control-Request-Headers");
  if (origin !== null && method !== null && headers !== null) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    const respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers": headers,
      "Access-Control-Allow-Origin": "*",
    };

    return new Response(null, {
      headers: respHeaders,
    });
  }

  return new Response(null, {
    headers: corsHeaders,
  });
}

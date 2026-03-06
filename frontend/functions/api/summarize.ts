export const onRequestPost = async ({ request }) => {
    return fetch("http://127.0.0.1:8787/", {
        method: "POST",
        body: request.body,
        headers: request.headers
    });
};

export const onRequestGet = async ({ request }) => {
    // This payload could be anything from within your app or from your frontend
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const newUrl = "http://127.0.0.1:8787/?instanceId=" + id;
    const response = await fetch(newUrl);
    return response;
};
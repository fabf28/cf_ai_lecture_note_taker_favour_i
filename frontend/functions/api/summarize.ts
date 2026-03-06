export const onRequestPost = async ({ request }) => {
    // This payload could be anything from within your app or from your frontend
    const form = await request.formData();
    const audio = form.get("audio");

    const forwardForm = new FormData();
    forwardForm.append("audio", audio, "recording.webm");

    const response = await fetch("http://127.0.0.1:8787/", {
        method: "POST",
        body: forwardForm
    });

    return response;
};
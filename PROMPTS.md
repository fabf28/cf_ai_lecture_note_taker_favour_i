
Prompts

Note: The commits indicate when each prompt was used and the changes applied for that particular prompt.

1. "In Home.tsx, create a page that asks the user to take record a lecture. This page will take in audio input preferably using the audioBlob method."

2. "Create a plain loading screen with 2 loading symbols that rerenders the screen or makes an api request every few seconds. Let this screen be called 'Loading'."

3. "Improve my prompt so that the ai returns a json each time. : const messages = [ { role: "system", content: 'You are note maker. You are creating taking in text that is a lecture transcript. You will first make sense of the transcript, then you will turn it into keyword/phrases matched with definitions. You will then summaraize that into notes. Return the following json structure for the notes: {"notes":[{"phrase": <the phrase>, "definition" : <the defenition>}, {"phrase": <the phrase>, "definition" : <the defenition>}, {"phrase": <the phrase>, "definition" : <the defenition>}, ...], "summary" : <the summary>}' }, { role: "user", content: text.transcript, }, ];"

4. "Consider json content in the following format: { "notes": [ { "phrase": "string", "definition": "string" } ], "summary": "string" } Write code to display the content on a page. There can be multiple items inside the "notes" list."

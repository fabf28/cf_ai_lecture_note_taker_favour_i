export async function getWorkflowInstanceStatus(env: Env, instanceId: string) {
	const instance = await env.MY_WORKFLOW.get(instanceId);
	return await instance.status();
}

export async function createWorkflowInstance(env: Env, path: string, name: string) {
	const instance = await env.MY_WORKFLOW.create({
		params: {
			path: path,
			name: name,
		},
	});
	return {
		id: instance.id,
		status: await instance.status(),
	};
}

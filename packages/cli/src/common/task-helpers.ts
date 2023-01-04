import { ListrTask } from 'listr';

export function createSendDataTask<TData>(
  title: string,
  completeTitle: string,
  fetchPath: string,
  data: TData
): ListrTask {
  return {
    title: title,
    task: async (ctx, task) => {
      // send the data to the API endpoint
      const response = await fetch(fetchPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // parse the response from the API
      const apiResponse = await response.json();

      // store the response in the task context
      ctx.response = apiResponse;

      // update the task title
      task.title = completeTitle;
    },
  };
}

// import express from 'express';
// import axios from 'axios';
import { ListrTask } from 'listr';
import loadAxios from './axios';

export function editEaCDraftTask<TData>(
  configDir: string,
  title: string,
  completeTitle: string,
  path: string,
  data: TData
): ListrTask {
  return {
    title: title,
    task: async (ctx, task) => {
      const axios = await loadAxios(configDir);

      const response = await axios.post(path, data);

      ctx.response = response.data;

      // update the task title
      task.title = completeTitle;
    },
  };
}

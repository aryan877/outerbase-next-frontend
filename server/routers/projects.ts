import { Project } from '@/types/types';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from './../trpc';

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const name = opts.input.name as string;
      try {
        return {
          data: name,
        };
      } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
      }
    }),

  listProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1).max(100),
      })
    )
    .query(async (opts) => {
      try {
        return {
          data: opts.input.projectId,
        };
      } catch (error) {
        console.error('Error listing project:', error);
        throw new Error('Failed to list project');
      }
    }),
});

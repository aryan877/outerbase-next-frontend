import { Project } from '@/types/types';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import S3 from 'aws-sdk/clients/s3';
import SQS from 'aws-sdk/clients/sqs';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { projectRouter } from './routers/projects';
import { createTRPCRouter, protectedProcedure, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
  projects: projectRouter,
});

export type AppRouter = typeof appRouter;

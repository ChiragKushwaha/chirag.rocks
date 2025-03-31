import { setProjectAnnotations } from '@storybook/experimental-nextjs-vite';
import { beforeAll } from 'vitest';
import * as projectAnnotations from './preview';

const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);

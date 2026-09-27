import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// supertest uses TypeScript's `export =` declaration.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { Server } from 'http';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => { if (app) await app.close(); });

  it('GET /health', async () => {
    const server = app.getHttpServer() as Server;
    const response = await request(server).get('/health').expect(200);
    expect((response.body as Record<string, unknown>).status).toBe('ok');
  });
});

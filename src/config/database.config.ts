import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'cxxc',
  password: process.env.DB_PASSWORD || '6jie8yO8nt85',
  database: process.env.DB_DATABASE || 'cxxc',
  entities: ['src/**/*.entity{.ts}'],
  migrations: ['src/migrations/*{.ts}'],
  autoLoadEntities: true,
};

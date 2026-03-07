import * as migration_20260215_192113_initial_schema from './20260215_192113_initial_schema';
import * as migration_20260216_155029 from './20260216_155029';
import * as migration_20260218_160449 from './20260218_160449';
import * as migration_20260306_183324 from './20260306_183324';

export const migrations = [
  {
    up: migration_20260215_192113_initial_schema.up,
    down: migration_20260215_192113_initial_schema.down,
    name: '20260215_192113_initial_schema',
  },
  {
    up: migration_20260216_155029.up,
    down: migration_20260216_155029.down,
    name: '20260216_155029',
  },
  {
    up: migration_20260218_160449.up,
    down: migration_20260218_160449.down,
    name: '20260218_160449',
  },
  {
    up: migration_20260306_183324.up,
    down: migration_20260306_183324.down,
    name: '20260306_183324'
  },
];

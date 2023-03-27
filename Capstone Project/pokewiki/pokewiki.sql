\echo 'Delete and recreate pokewiki db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pokewiki;
CREATE DATABASE pokewiki;
\connect pokewiki

\i pokewiki-schema.sql
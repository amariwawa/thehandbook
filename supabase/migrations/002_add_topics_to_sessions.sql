alter table user_sessions add column topics text[] default null;

comment on column user_sessions.topics is 'Array of topic names covered in this session';

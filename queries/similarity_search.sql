create or replace function match_notes (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  query_user_id uuid
)
returns table (
  id bigint,
  keyword text,
  definition text,
  lecture_id bigint,
  user_id uuid,
  similarity float
)
language sql stable
as $$
  select
    notes.id,
    notes.keyword,
    notes.definition,
    notes.lecture_id,
    notes.user_id,
    1 - (notes.embedding <=> query_embedding) as similarity
  from notes
  where notes.user_id = query_user_id
    and 1 - (notes.embedding <=> query_embedding) > match_threshold
  order by notes.embedding <=> query_embedding
  limit match_count;
$$;

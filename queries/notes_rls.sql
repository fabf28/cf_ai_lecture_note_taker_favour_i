-- Allow users to create (INSERT) their own notes
create policy "Allow users to insert their own notes" on public.notes for insert to authenticated
with
    check (auth.uid () = user_id);

-- Allow users to modify (UPDATE) their own notes
create policy "Allow users to update their own notes" on public.notes for
update to authenticated using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

-- Allow users to remove (DELETE) their own notes
create policy "Allow users to delete their own notes" on public.notes for delete to authenticated using (auth.uid () = user_id);

-- Allow logged-in users to read their own note rows
create policy "Allow users to read their own notes" on public.notes for
select
    to authenticated using (auth.uid () = user_id);
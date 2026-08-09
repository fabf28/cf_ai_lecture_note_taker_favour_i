-- Allow users to create (INSERT) their own lectures
create policy "Allow users to insert their own lectures" on public.lectures for insert to authenticated
with
    check (auth.uid () = user_id);

-- Allow users to modify (UPDATE) their own lectures (e.g., renaming the lecture)
create policy "Allow users to update their own lectures" on public.lectures for
update to authenticated using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

-- Allow users to remove (DELETE) their own lectures
create policy "Allow users to delete their own lectures" on public.lectures for delete to authenticated using (auth.uid () = user_id);

-- Allow logged-in users to read their own lecture rows
create policy "Allow users to read their own lectures" on public.lectures for
select
    to authenticated using (auth.uid () = user_id);
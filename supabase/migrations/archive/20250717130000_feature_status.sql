alter table feature_requests add column if not exists status text default 'pending';
alter table feature_requests add column if not exists admin_comment text; 
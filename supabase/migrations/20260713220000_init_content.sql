-- Albert Mends site schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  date date not null default current_date,
  read_time text not null default '5 min read',
  category text not null default 'General',
  year text not null default extract(year from current_date)::text,
  upvotes integer not null default 0,
  tags text[] not null default '{}',
  author text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_date_idx on public.blog_posts (date desc);
create index if not exists blog_posts_published_idx on public.blog_posts (published);

-- Guestbook signatures
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null default '',
  signature text not null,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

-- Gallery (empty for now; ready when you add media)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  src text not null,
  type text not null check (type in ('image', 'video')),
  caption text,
  date text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_sort_idx
  on public.gallery_items (sort_order asc, created_at desc);

-- Atomically increment blog upvotes
create or replace function public.increment_blog_upvotes(post_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.blog_posts
  set upvotes = upvotes + 1,
      updated_at = now()
  where slug = post_slug
  returning upvotes into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_blog_upvotes(text) to anon, authenticated;

-- Row Level Security
alter table public.blog_posts enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "Public can read guestbook" on public.guestbook_entries;
create policy "Public can read guestbook"
  on public.guestbook_entries for select
  using (true);

drop policy if exists "Public can sign guestbook" on public.guestbook_entries;
create policy "Public can sign guestbook"
  on public.guestbook_entries for insert
  with check (
    char_length(trim(name)) > 0
    and char_length(name) <= 40
    and char_length(message) <= 200
    and char_length(signature) > 100
    and char_length(signature) <= 350000
    and signature like 'data:image/png;base64,%'
  );

drop policy if exists "Public can read gallery" on public.gallery_items;
create policy "Public can read gallery"
  on public.gallery_items for select
  using (true);

-- Seed the existing blog post
insert into public.blog_posts (
  slug, title, excerpt, content, date, read_time, category, year, upvotes, tags, published
) values (
  'welcome-to-2025',
  'Quarter Life Crisis: Navigating Your 20s and 30s',
  'Understanding and overcoming the challenges of quarter-life crisis while building a meaningful career and life.',
  $md$
# Quarter Life Crisis: Navigating Your 20s and 30s

The quarter-life crisis hits differently for everyone, but it's a universal experience that most of us face in our 20s and early 30s. It's that overwhelming feeling of uncertainty about your career, relationships, and life direction that can leave you questioning everything you thought you knew about yourself.

## What is Quarter Life Crisis? {#what-is-quarter-life-crisis}

A quarter-life crisis typically occurs between the ages of 20-35, when young adults face the pressure of making life-defining decisions while feeling uncertain about their choices. It's characterized by anxiety, self-doubt, and the overwhelming sense that everyone else has their life figured out except you.

### Common Signs of Quarter Life Crisis:

- **Career Uncertainty**: Feeling lost about your professional path
- **Comparison Trap**: Constantly comparing yourself to peers on social media
- **Decision Paralysis**: Overwhelmed by too many choices and possibilities
- **Identity Confusion**: Questioning who you are and what you want
- **FOMO (Fear of Missing Out)**: Feeling like you're missing out on life experiences

## The Pressure of Modern Expectations {#modern-expectations}

Today's young adults face unprecedented pressure from multiple sources, making the quarter-life crisis more intense than ever before.

### Sources of Pressure:

- **Social Media**: Constant exposure to curated highlight reels of others' lives
- **Economic Uncertainty**: Job market instability and financial pressures
- **Delayed Milestones**: Traditional life markers happening later in life
- **Information Overload**: Too many options and paths to choose from
- **Perfectionism Culture**: The pressure to have everything figured out perfectly

## Career and Professional Development {#career-development}

One of the biggest sources of quarter-life crisis anxiety is career uncertainty. The pressure to find your "passion" and build a successful career can be overwhelming.

### Navigating Career Challenges:

- **Embrace Exploration**: It's okay to try different roles and industries
- **Focus on Skills**: Build transferable skills rather than fixating on job titles
- **Network Authentically**: Build genuine relationships, not just professional connections
- **Learn Continuously**: Invest in your personal and professional development
- **Define Success for Yourself**: Don't let others define what success means to you

## Building Meaningful Relationships {#relationships}

Relationships become more complex in your 20s and 30s, adding another layer to the quarter-life crisis experience.

### Relationship Challenges:

- **Dating in the Digital Age**: Navigating online dating and modern relationship dynamics
- **Friendship Evolution**: Maintaining friendships as life circumstances change
- **Family Expectations**: Balancing family expectations with personal desires
- **Work-Life Integration**: Finding time for relationships while building a career

## Financial Independence and Planning {#financial-planning}

Money concerns often exacerbate quarter-life crisis anxiety, especially when you're trying to establish financial independence.

### Financial Wellness Strategies:

- **Start Small**: Begin with basic budgeting and emergency fund building
- **Invest in Yourself**: Education and skill development are investments
- **Avoid Lifestyle Inflation**: Don't spend more just because you earn more
- **Plan for the Future**: Start retirement planning early, even with small amounts
- **Seek Professional Advice**: Consider consulting a financial advisor

## Mental Health and Self-Care {#mental-health}

Taking care of your mental health is crucial during this challenging life phase.

### Self-Care Practices:

- **Mindfulness and Meditation**: Develop practices to manage anxiety and stress
- **Physical Health**: Regular exercise and proper nutrition support mental well-being
- **Therapy and Counseling**: Professional help can provide valuable perspective
- **Digital Detox**: Take breaks from social media and constant connectivity
- **Hobbies and Interests**: Maintain activities that bring you joy outside of work

## Finding Your Path Forward {#finding-your-path}

While the quarter-life crisis can feel overwhelming, it's also an opportunity for growth and self-discovery.

### Strategies for Moving Forward:

- **Embrace Uncertainty**: Accept that it's normal not to have everything figured out
- **Set Small Goals**: Break down big dreams into manageable steps
- **Practice Gratitude**: Focus on what you have rather than what you lack
- **Seek Mentorship**: Learn from those who have navigated similar challenges
- **Trust the Process**: Remember that growth takes time and patience

## Conclusion

The quarter-life crisis is not a sign of failure—it's a natural part of growing up and finding your place in the world. By acknowledging these feelings, seeking support, and taking intentional steps toward your goals, you can navigate this challenging period and emerge stronger and more self-aware.

Remember, everyone's journey is different, and there's no "right" timeline for life milestones. Be patient with yourself, celebrate small wins, and trust that you're exactly where you need to be in this moment.

_Are you experiencing a quarter-life crisis? What strategies have helped you navigate this challenging life phase? Share your thoughts and let's support each other through this journey._
$md$,
  '2025-01-01',
  '8 min read',
  'Personal Development',
  '2025',
  2,
  array['Quarter Life Crisis', 'Personal Development', 'Career', 'Life Lessons', 'Growth'],
  true
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  date = excluded.date,
  read_time = excluded.read_time,
  category = excluded.category,
  year = excluded.year,
  tags = excluded.tags,
  updated_at = now();

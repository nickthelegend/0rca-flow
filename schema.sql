-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.access_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  token_hash text NOT NULL UNIQUE,
  name character varying,
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT access_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT access_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.agent_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  user_id uuid,
  action character varying,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_usage_logs_pkey PRIMARY KEY (id),
  CONSTRAINT agent_usage_logs_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id)
);
CREATE TABLE public.agents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name character varying NOT NULL,
  description text,
  subdomain character varying NOT NULL UNIQUE,
  repo_owner character varying,
  repo_name character varying,
  github_url text,
  configuration jsonb DEFAULT '{"goal": "", "role": "", "tools": [], "skills": [], "greeting": "Hello! I am your AI agent. How can I assist you today?", "shortcuts": [], "auth_method": "None", "constraints": [], "mcp_servers": []}'::jsonb,
  image_url text,
  inference_url text,
  k8s_deployment_name text,
  k8s_service_name text,
  k8s_namespace text DEFAULT 'agents'::text,
  port integer DEFAULT 8000,
  cpu_limit text DEFAULT '500m'::text,
  memory_limit text DEFAULT '1Gi'::text,
  ipfs_cid text,
  chain_agent_id text,
  contract_address text,
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  github_repo text,
  git_branch text DEFAULT 'main'::text,
  CONSTRAINT agents_pkey PRIMARY KEY (id),
  CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.chats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  hash text NOT NULL UNIQUE,
  wallet_address text NOT NULL,
  title text DEFAULT 'New Chat'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chats_pkey PRIMARY KEY (id)
);
CREATE TABLE public.deployments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  user_id uuid,
  job_id character varying,
  status character varying DEFAULT 'pending'::character varying,
  build_logs text,
  deployment_summary jsonb,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT deployments_pkey PRIMARY KEY (id),
  CONSTRAINT deployments_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id),
  CONSTRAINT deployments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.deployments_kubernetes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  deployment_id uuid,
  agent_id uuid,
  job_name text,
  deployment_name text,
  service_name text,
  ingress_name text,
  namespace text DEFAULT 'default'::text,
  cluster_ip text,
  external_dns text,
  replicas integer DEFAULT 1,
  cpu_used text,
  memory_used text,
  phase character varying DEFAULT 'Pending'::character varying,
  raw_events jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT deployments_kubernetes_pkey PRIMARY KEY (id),
  CONSTRAINT deployments_kubernetes_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployments(id),
  CONSTRAINT deployments_kubernetes_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chat_id uuid,
  role text NOT NULL CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text])),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info'::text CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text, 'update'::text])),
  icon text DEFAULT 'bell'::text,
  link text,
  is_global boolean DEFAULT true,
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  plan text NOT NULL CHECK (plan = ANY (ARRAY['starter'::text, 'pro'::text, 'enterprise'::text])),
  tx_hash text,
  started_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_notification_reads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  notification_id uuid,
  wallet_address text NOT NULL,
  read_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_notification_reads_pkey PRIMARY KEY (id),
  CONSTRAINT user_notification_reads_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id)
);

CREATE TABLE public.workflows (
  id text NOT NULL,
  wallet_address text,
  name character varying NOT NULL,
  description text,
  nodes jsonb DEFAULT '[]'::jsonb,
  edges jsonb DEFAULT '[]'::jsonb,
  deployment_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workflows_pkey PRIMARY KEY (id)
);

CREATE TABLE public.agent_workflows (
  id text NOT NULL,
  wallet_address text,
  name character varying NOT NULL,
  description text,
  category text,
  model text,
  system_prompt text,
  tools jsonb DEFAULT '[]'::jsonb,
  nodes jsonb DEFAULT '[]'::jsonb,
  edges jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_workflows_pkey PRIMARY KEY (id)
);

-- ====================================================================================
-- 1. 테이블 생성
-- ====================================================================================

-- 1-1. profiles (사회복지사 계정)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 1-2. clients (대상자 정보)
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  address TEXT,
  registration_date DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 1-3. sessions (상담일지)
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  content TEXT NOT NULL,
  future_plan TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 성능 최적화를 위한 인덱스 생성
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_sessions_client_id ON public.sessions(client_id);
CREATE INDEX idx_sessions_session_date ON public.sessions(session_date DESC);

-- ====================================================================================
-- 2. Row Level Security (RLS) 정책 설정 (매우 중요)
-- ====================================================================================

-- 테이블 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- [정책 가정]
-- 복지관 시스템 특성상 '인증된 사용자(로그인한 사회복지사)'는 모든 대상자와 상담일지를 열람할 수 있습니다.
-- 단, 데이터의 수정 및 삭제는 보다 엄격하게 관리할 수 있도록 구성했습니다.

-- profiles 정책
CREATE POLICY "인증된 사용자는 모든 프로필 조회 가능" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "본인의 프로필만 수정 가능" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- clients 정책
CREATE POLICY "인증된 사용자는 모든 대상자 조회 가능" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "인증된 사용자는 대상자 등록 가능" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "인증된 사용자는 대상자 수정 가능" ON public.clients FOR UPDATE TO authenticated USING (true);
-- 삭제는 안전을 위해 신중하게 접근하도록 설정하거나, 필요시 특정 관리자 역할만 가능하게 할 수 있습니다. 
-- 여기서는 인증된 모든 사용자가 가능하도록 설정합니다.
CREATE POLICY "인증된 사용자는 대상자 삭제 가능" ON public.clients FOR DELETE TO authenticated USING (true);

-- sessions 정책
CREATE POLICY "인증된 사용자는 모든 상담일지 조회 가능" ON public.sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "인증된 사용자는 상담일지 작성 가능" ON public.sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "본인이 작성한 상담일지만 수정 가능" ON public.sessions FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "본인이 작성한 상담일지만 삭제 가능" ON public.sessions FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ====================================================================================
-- 3. 트리거 (Trigger) 설정
-- ====================================================================================
-- Supabase Auth에 새 사용자가 가입(생성)될 때 자동으로 profiles 테이블에 레코드를 생성합니다.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  -- Auth의 메타데이터에 full_name이 있을 경우 가져오고, 없으면 '사회복지사'를 기본값 사용
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', '사회복지사'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

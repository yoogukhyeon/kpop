import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto grid max-w-sm gap-6 pt-20">
      <div className="grid gap-1 text-center">
        <p className="text-2xl font-black">SideQuest<span className="text-brand"> Day</span></p>
        <h1 className="text-sm font-bold text-muted">관리자 로그인</h1>
      </div>
      <LoginForm next={next ?? "/admin"} />
    </div>
  );
}

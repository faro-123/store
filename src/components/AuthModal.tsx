import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../services/api';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: Props) {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const user = useStore((state) => state.user);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [serverMsg, setServerMsg] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMsg('');
    const data = new FormData(event.currentTarget);
    const username = String(data.get('name') || '').trim();
    const password = String(data.get('password') || '');
    const email = String(data.get('email') || '').trim();

    if (!username || !password) {
      setServerMsg('用户名和密码不能为空');
      return;
    }

    if (mode === 'register') {
      try {
        const res = await api.register(username, password, email || undefined);
        if (res.success && res.userId) {
          login({
            name: username,
            email: res.email || email || `${username}@example.com`,
            userId: String(res.userId),
          });
          onClose();
        } else {
          setServerMsg(res.message || '注册失败');
        }
      } catch {
        setServerMsg('网络错误，请稍后重试');
      }
    } else {
      try {
        const res = await api.login(username, password);
        if (res.success && res.userId) {
          login({
            name: username,
            email: res.email || email || `${username}@example.com`,
            userId: String(res.userId),
          });
          onClose();
        } else {
          setServerMsg(res.message || '用户名或密码错误');
        }
      } catch {
        setServerMsg('网络错误，请稍后重试');
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-lift backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-teal-700">Atelier Account</p>
                <h2 className="mt-1 text-2xl font-black">{mode === 'login' ? '欢迎回来' : '创建账号'}</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="关闭" title="关闭">
                <X size={18} />
              </button>
            </div>
            {user ? (
              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-sm text-white/60">当前账号</p>
                <p className="mt-2 text-xl font-black">{user.name}</p>
                <p className="text-sm text-white/70">{user.email}</p>
                <button
                  className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  退出登录
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <div className="flex rounded-full bg-slate-100 p-1">
                  {(['login', 'register'] as const).map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${mode === item ? 'bg-white shadow-sm' : 'text-slate-500'}`}
                      onClick={() => { setMode(item); setServerMsg(''); }}
                    >
                      {item === 'login' ? '登录' : '注册'}
                    </button>
                  ))}
                </div>
                <input className="field" name="name" placeholder="用户名" required />
                <input className="field" name="email" type="email" placeholder="邮箱（选填）" />
                <input className="field" name="password" type="password" placeholder="密码" required />
                {serverMsg && <p className="text-sm text-rose-500 font-bold">{serverMsg}</p>}
                <button className="primary-button w-full" type="submit">
                  {mode === 'login' ? '进入商店' : '创建并登录'}
                </button>
              </form>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

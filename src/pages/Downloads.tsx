import { Download, FileArchive, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../store/useStore';

export default function Downloads() {
  const purchased = useStore((state) => state.purchased);
  const owned = products.filter((product) => purchased.includes(product.id));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-700">Library</p>
          <h1 className="mt-2 text-4xl font-black">下载管理</h1>
        </div>
        <Link to="/" className="secondary-button">
          继续浏览
        </Link>
      </div>

      {owned.length === 0 ? (
        <div className="rounded-[32px] border border-white/70 bg-white/75 p-10 text-center shadow-material backdrop-blur">
          <PackageOpen className="mx-auto text-slate-400" size={48} />
          <h2 className="mt-5 text-2xl font-black">暂无已购产品</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-500">完成模拟支付后，已购产品会出现在这里，可查看版本、下载包和许可证信息。</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {owned.map((product) => (
            <article key={product.id} className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-material backdrop-blur">
              <div className="flex gap-4">
                <img src={product.image} alt={product.title} className="h-24 w-24 rounded-3xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-black">{product.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">v1.4.2</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">商业授权</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button className="primary-button justify-center">
                  <Download size={18} /> 下载资源包
                </button>
                <button className="secondary-button justify-center">
                  <FileArchive size={18} /> 查看许可证
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { HelpCircle, ChevronLeft, Phone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ViewState = "qr" | "login" | "video";

export default function App() {
  const [view, setView] = useState<ViewState>("qr");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startRickroll = () => {
    setLoading(true);
    
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {
        console.log("Fullscreen request denied, playing anyway...");
      });
    }

    if (videoRef.current) {
      videoRef.current.volume = 1.0;
      videoRef.current.play().then(() => {
        setView("video");
        setLoading(false);
      }).catch((err) => {
        console.error("Autoplay failed:", err);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#09090b] text-white font-sans overflow-hidden flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.08'%3E%3Cpath d='M30 30l10 10m-10 0l10-10M90 20a5 5 0 100 10 5 5 0 000-10zM150 40h10v10h-10zM20 100c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5zM100 120l15 15M160 100l-10 10m0-10l10 10M60 150h12v4H60zM130 160c5 0 5-5 10-5s5 5 10 5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '360px 360px'
      }}
    >
      {/* Overlay darkening */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {view === "qr" && (
          <motion.div
            key="qr-view"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-[480px] bg-[#121214] rounded-[32px] p-12 flex flex-col items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative z-10"
          >
            <div className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors cursor-pointer">
              <HelpCircle size={24} />
            </div>

            <div className="mt-8 mb-12 relative flex items-center justify-center">
              <div className="w-56 h-56 bg-white rounded-[32px] p-4 flex flex-col items-center justify-center relative shadow-[0_0_60px_rgba(255,255,255,0.08)]">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-12 h-12 border-4 border-gray-100 border-t-red-500 rounded-full"
                  />
                  <span className="text-red-500 text-[13px] font-bold text-center leading-tight">
                    Не удаётся создать <br /> QR-code
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-[24px] font-bold mb-4 tracking-tight">Войдите в MAX по QR-коду</h2>
            <p className="text-white/30 text-[15px] leading-[1.6] max-w-[320px] mb-14">
              Наведите камеру на QR-код, чтобы войти в профиль или скачать приложение
            </p>

            <button 
              onClick={() => setView("login")}
              className="w-full py-4.5 rounded-2xl border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.03] transition-all text-[15px] font-semibold"
            >
              Войти через телефон и пароль
            </button>
          </motion.div>
        )}

        {view === "login" && (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
            className="w-[440px] bg-[#121214] rounded-[40px] p-12 flex flex-col shadow-2xl border border-white/5 relative z-10"
          >
            <div 
              onClick={() => setView("qr")}
              className="absolute top-10 left-10 text-white/30 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest"
            >
              <ChevronLeft size={18} /> Назад
            </div>

            <div className="mt-14 mb-12 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#007AFF] rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="text-white font-black italic text-3xl">M</span>
              </div>
              <h2 className="text-[28px] font-black tracking-tight">Вход в аккаунт</h2>
            </div>

            <div className="space-y-5 mb-12 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Номер телефона</label>
                <div className="relative group">
                  <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__"
                    className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[22px] pl-14 pr-6 text-xl focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all placeholder:text-white/5 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Пароль доступа</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-[22px] pl-14 pr-6 text-xl focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all placeholder:text-white/5 font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={startRickroll}
              disabled={loading}
              className="w-full h-16 bg-[#007AFF] text-white font-black rounded-[22px] shadow-[0_15px_30px_rgba(0,122,255,0.2)] hover:bg-[#0062CC] hover:-translate-y-0.5 transition-all active:scale-[0.97] active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "ВОЙТИ"
              )}
            </button>

            <div className="text-center">
              <span className="text-xs text-white/20 font-medium tracking-tight">Нет аккаунта? </span>
              <span 
                onClick={startRickroll}
                className="text-xs text-[#007AFF] font-black cursor-pointer hover:underline transition-all uppercase tracking-widest"
              >
                Зарегистрироваться
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <video
        ref={videoRef}
        className={`fixed inset-0 w-full h-full object-cover z-[100] bg-black ${view === "video" ? 'block' : 'hidden'}`}
        onEnded={() => setView("qr")}
        autoPlay={false}
        playsInline
        controls={false}
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src="./rickroll.mp4" type="video/mp4" />
        <source src="https://shattereddisk.github.io/rickroll/rickroll.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

    </div>
  );
}





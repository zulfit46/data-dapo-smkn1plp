import React, { useState } from 'react';
import { GTKData } from '../types';
import { DAPO1_BASE64 } from '../assets/dapo1Base64';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  Building2 
} from 'lucide-react';

interface LoginViewProps {
  gtkList: GTKData[];
  onLogin: (gtk: GTKData) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ gtkList, onLogin }) => {
  // 'auth'  = kartu Autentikasi (gaya splash resmi Dapodik, tampil lebih dulu)
  // 'login' = form Email + Password
  const [step, setStep] = useState<'auth' | 'login'>('auth');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password default: dipakai jika kolom "Password" di sheet GTK kosong / belum ada.
  // Saat kolom "Password" ditambahkan di sheet, otomatis dipakai nilai per-user.
  const DEFAULT_PASSWORD = 'Smkn1palopo*';

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);

    let candidateList = gtkList;
    try {
      const res = await fetch('/api/gtk?force=true');
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          candidateList = json.data;
        }
      }
    } catch {}

    // Cari GTK berdasarkan Email (case-insensitive)
    const matched = candidateList.find((g) => {
      const gEmail = (g.email || '').trim().toLowerCase();
      return gEmail && gEmail === email;
    });

    if (!matched) {
      setIsLoading(false);
      setErrorMsg(`Email "${emailInput.trim()}" tidak ditemukan dalam database GTK.`);
      return;
    }

    // Verifikasi password: pakai password dari sheet (kolom "Password"), fallback ke DEFAULT_PASSWORD.
    // Guard: string "null"/"undefined" (output GViz untuk cell kosong) dianggap kosong.
    const rawPwd = (matched.password || '').trim();
    const expectedPassword = (rawPwd && rawPwd.toLowerCase() !== 'null' && rawPwd.toLowerCase() !== 'undefined')
      ? rawPwd
      : DEFAULT_PASSWORD;
    if (password !== expectedPassword) {
      setIsLoading(false);
      setErrorMsg('Password salah. Periksa kembali email & password Anda.');
      return;
    }

    setIsLoading(false);
    onLogin(matched);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 antialiased overflow-hidden bg-slate-950">
      {/* Background Image: Fit/Fill whole viewport completely without cropping */}
      <img
        src="/bg.png"
        alt="Background Form Login SMKN 1 Palopo"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
      />
      {/* Subtle translucent veil so text and login card contrast perfectly while preserving the full image */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* ================= STEP 1: KARTU AUTENTIKASI (gaya Dapodik SSO) ================= */}
      {step === 'auth' && (
        <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/50 border border-white/60 overflow-hidden">
            {/* Banner Pemandangan Gunung */}
            <div className="relative h-44 sm:h-52">
              <img
                src="/mountains.png"
                alt="Pemandangan pegunungan"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              {/* Badge logo bulat menimpa tepi bawah banner */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 z-10">
                <div className="w-24 h-24 sm:w-[104px] sm:h-[104px] rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] ring-4 ring-white/70 flex items-center justify-center p-2.5 sm:p-3">
                  <img
                    src={DAPO1_BASE64 || '/dapo-1.png'}
                    alt="Logo SMKN 1 Palopo"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Judul & Tombol SSO */}
            <div className="pt-16 sm:pt-[72px] pb-8 sm:pb-9 px-6 sm:px-10 text-center">
              <h1 className="text-2xl sm:text-[27px] font-medium text-slate-600 tracking-wide">
                Autentikasi
              </h1>
              <p className="text-[13px] sm:text-sm text-slate-400 mt-1">
                Pengguna Dapodik
              </p>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="mt-7 inline-flex items-center justify-center gap-2.5 w-full max-w-[340px] px-7 py-3.5 rounded-full bg-[#29abe2] hover:bg-[#1d9cd4] active:bg-[#1893c9] text-white font-bold text-[11.5px] sm:text-[13px] tracking-[0.06em] uppercase shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <KeyRound className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span>Login Menggunakan SSO</span>
              </button>
            </div>

            {/* Catatan Pengguna */}
            <div className="bg-slate-50/95 border-t border-slate-100 px-6 sm:px-8 py-5">
              <ol className="space-y-2 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
                <li className="flex gap-2.5">
                  <span className="shrink-0">1.</span>
                  <span>Pastikan menggunakan email yang aktif</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="shrink-0">2.</span>
                  <span>Tidak diperkenankan menggunakan email orang lain</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="shrink-0">3.</span>
                  <span>Pengaturan ulang akun dapat melalui Manajemen Dapodik</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: FORM LOGIN EMAIL + PASSWORD ================= */}
      {step === 'login' && (
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Card Header & Brand with Glassmorphism */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-950/40 border border-white/50 overflow-hidden transition-all duration-300">
          {/* Top Brand Banner - Styled matching uploaded mockup */}
          <div className="bg-gradient-to-r from-[#440b82] via-[#291e8e] to-[#0c62d8] px-6 py-8 sm:py-9 text-white text-center relative overflow-hidden">
            {/* Background Decorative: Left Concentric Arcs / Waves */}
            <svg 
              className="absolute -left-12 -top-12 w-64 h-64 pointer-events-none opacity-20" 
              viewBox="0 0 200 200" 
              fill="none"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="110" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
              <circle cx="50" cy="50" r="85" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" />
              <circle cx="50" cy="50" r="60" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.8" strokeOpacity="0.7" />
            </svg>

            {/* Background Decorative: Right Tech Wireframe / Mesh Waves */}
            <svg 
              className="absolute -right-6 -bottom-6 w-72 h-48 pointer-events-none opacity-30" 
              viewBox="0 0 300 200" 
              fill="none"
              aria-hidden="true"
            >
              <path d="M40,180 Q120,80 200,120 T320,50" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.8" fill="none" />
              <path d="M20,190 Q105,95 185,135 T305,70" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.7" fill="none" />
              <path d="M60,170 Q135,65 215,105 T335,35" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
              <path d="M0,200 Q85,115 165,155 T285,90" stroke="#93c5fd" strokeWidth="0.7" strokeOpacity="0.5" fill="none" />
              <path d="M80,160 L120,95 L150,115 L190,85 L230,125 L260,95 L300,130" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.5" fill="none" />
              <path d="M120,95 L160,125 L200,135 L240,155 L280,125" stroke="#93c5fd" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
              <path d="M150,115 L180,95 L220,135 L260,105" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
            </svg>

            {/* Subtle light aura glow behind squircle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-36 h-36 bg-blue-400/25 rounded-full blur-xl pointer-events-none" />

            {/* Center Logo Squircle with Glowing Double Aura */}
            <div className="relative z-10 mx-auto mb-3.5 inline-flex items-center justify-center">
              {/* Outer Glowing Ring */}
              <div className="p-1 rounded-[26px] bg-gradient-to-br from-white/70 via-blue-200/40 to-indigo-300/30 shadow-[0_0_28px_rgba(96,165,250,0.65),0_10px_25px_rgba(0,0,0,0.35)] outline outline-2 outline-white/30 outline-offset-2">
                {/* White Squircle Box */}
                <div className="w-[78px] h-[78px] sm:w-[86px] sm:h-[86px] bg-white rounded-[22px] p-2 sm:p-2.5 flex items-center justify-center shadow-inner">
                  {/* Logo Asli Sekolah SMKN 1 Palopo */}
                  <img
                    src={DAPO1_BASE64 || '/dapo-1.png'}
                    alt="Logo SMKN 1 Palopo"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-[26px] font-black tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mt-1">
              DAPODIK
            </h1>
            <p className="text-xs sm:text-[13px] text-blue-50/90 font-medium tracking-normal mt-0.5">
              SMKN 1 PALOPO
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Tombol kembali ke kartu autentikasi */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setErrorMsg(null);
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Kembali ke halaman autentikasi"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-base font-bold text-slate-800">
                Masuk Menggunakan Akun Dapodik
              </h2>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    autoFocus
                    aria-label="Username"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-300 font-semibold text-slate-800 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    aria-label="Password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-300 font-semibold text-slate-800 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Aplikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer school info */}
            <div className="text-center pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3" /> SMKN 1 Palopo • Sulawesi Selatan
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

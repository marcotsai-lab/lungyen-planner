import React, { useState, useEffect, useRef } from "react";
import {
  Calculator,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Coins,
  Lock,
  Image as ImageIcon,
  Building,
  Flower2,
  Search,
  ArrowRight,
  X,
  MapPin,
  BookOpen,
  Sparkles,
  Copy,
  RefreshCw,
} from "lucide-react";

// 👇 您的 LINE 加入好友連結
const LINE_URL = "https://line.me/ti/p/1w4k6tzNl0";

// 👇 您的頭貼圖片連結
// (若是上傳到 CodeSandbox public 資料夾，請填 "/檔名.jpg"，例如 "/avatar.jpg")
// (若是網路圖片，請填完整網址 "https://...")
// (若留空 ""，則會顯示預設的「龍」字 logo)
const AVATAR_URL = "/S__14172162.jpg";

// 👇 電子版關懷手冊連結
const MANUAL_URL =
  "https://www.lyls.com.tw/uploads/book/%E9%97%9C%E6%87%B7%E6%89%8B%E5%86%8A/manualtc/manual.html#p=1";

// Gemini API Configuration
const apiKey = "AIzaSyD8W9ADUaSt6SSOzjhjCHqMepdJMw87ZlI"; // System will provide the key at runtime

const App = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    // 修改 pb-32 以預留更多底部空間給懸浮導覽列
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* 頭貼顯示邏輯：有設定網址就顯示圖片，沒設定就顯示預設 Logo */}
            {AVATAR_URL ? (
              <img
                src={AVATAR_URL}
                alt="顧問頭貼"
                className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100"
              />
            ) : (
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-amber-400 font-serif font-bold">
                龍
              </div>
            )}
            <span className="font-bold text-slate-800 tracking-wide">
              生命圓滿規劃
            </span>
          </div>
          <button
            onClick={() => window.open(LINE_URL, "_blank")}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <Phone size={14} />
            聯絡顧問
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-140px)]">
        {activeTab === "calculator" && <InflationCalculator />}
        {activeTab === "brand" && <BrandAssurance />}
        {activeTab === "ai-assistant" && <AIConsultant />}
        {activeTab === "gallery" && <ServiceGallery />}
        {activeTab === "checklist" && <LegacyChecklist />}
      </main>

      {/* Bottom Navigation (懸浮式) */}
      <nav className="fixed bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-2xl max-w-sm mx-auto z-50">
        <div className="flex justify-between items-center h-16 px-2">
          <NavButton
            active={activeTab === "calculator"}
            onClick={() => setActiveTab("calculator")}
            icon={<Calculator size={20} />}
            label="試算"
          />
          <NavButton
            active={activeTab === "brand"}
            onClick={() => setActiveTab("brand")}
            icon={<Shield size={20} />}
            label="保障"
          />
          <NavButton
            active={activeTab === "ai-assistant"}
            onClick={() => setActiveTab("ai-assistant")}
            icon={
              <Sparkles
                size={20}
                className={
                  activeTab === "ai-assistant"
                    ? "text-amber-500 fill-amber-500"
                    : ""
                }
              />
            }
            label="AI助手"
            highlight
          />
          <NavButton
            active={activeTab === "gallery"}
            onClick={() => setActiveTab("gallery")}
            icon={<MapPin size={20} />}
            label="塔位"
          />
          <NavButton
            active={activeTab === "checklist"}
            onClick={() => setActiveTab("checklist")}
            icon={<FileText size={20} />}
            label="清單"
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, highlight }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative rounded-xl ${
      active
        ? "text-amber-600 scale-105"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    <div
      className={`transition-transform duration-300 ${
        active ? "-translate-y-1" : ""
      }`}
    >
      {icon}
    </div>
    <span
      className={`text-[10px] mt-1 font-medium ${active ? "font-bold" : ""}`}
    >
      {label}
    </span>
    {highlight && !active && (
      <span className="absolute top-2 right-3 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
    )}
  </button>
);

// --- Feature: Gemini AI Consultant ---
const AIConsultant = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const responseRef = useRef(null);

  const quickPrompts = [
    {
      title: "💌 寫給家人的信",
      prompt:
        "我想寫一封信給我的太太和小孩，告訴他們我很愛他們，不用為我的離開感到悲傷，要快樂地活下去。請幫我撰寫一篇溫暖、感人但不沉重的家書草稿。",
    },
    {
      title: "🙏 佛教禮俗詢問",
      prompt:
        "請問在台灣的傳統佛教喪葬禮儀中，家屬在頭七之前需要注意哪些禁忌或準備事項？",
    },
    {
      title: "⛪ 基督教儀式",
      prompt: "請問基督教的告別式流程通常是如何？跟傳統儀式有什麼最大的不同？",
    },
    {
      title: "📜 預立遺囑建議",
      prompt:
        "我想預立遺囑，請問在法律上和情感上，有哪些重點是我應該要包含進去的？",
    },
  ];

  const handleSend = async (textOverride) => {
    const promptText = textOverride || input;
    if (!promptText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse("");
    if (textOverride) setInput(textOverride); // Reflect quick prompt in input

    try {
      const systemInstruction =
        "你是龍巖生命服務的專業AI顧問。你的語氣溫暖、尊重、專業且充滿同理心。你的任務是協助客戶了解台灣的喪葬禮俗（包含佛教、道教、基督教等）、回答關於生前契約的規劃問題，以及協助客戶撰寫情感真摯的「給家人的話」或遺囑草稿。請用繁體中文回答，回答要條理分明，若涉及法律或醫療建議，請溫馨提醒諮詢專業人士。";

      const result = await callGeminiWithBackoff(promptText, systemInstruction);
      setResponse(result);

      // Auto scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error("AI Error:", err);
      setError("抱歉，AI 助手目前連線忙碌中，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (response) {
      const textarea = document.createElement("textarea");
      textarea.value = response;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("已複製內容！");
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="text-amber-500 fill-amber-500" size={24} />
          AI 傳承助手
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          不僅規劃身後事，更要傳承愛與回憶
        </p>
      </div>

      {/* Quick Prompts */}
      {!response && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-amber-400 hover:bg-amber-50 transition-all shadow-sm group"
            >
              <div className="font-bold text-slate-800 text-sm mb-1 group-hover:text-amber-700">
                {item.title}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-2">
                {item.prompt}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <label className="text-sm font-bold text-slate-700 mb-2 block">
          您想詢問什麼？或需要協助撰寫什麼內容？
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：幫我寫一段話給我的女兒，告訴她爸爸永遠愛她..."
          className="w-full h-32 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none mb-3"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
            isLoading || !input.trim()
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              AI 思考中...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              開始生成
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Response Area */}
      {response && (
        <div ref={responseRef} className="animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              AI 建議內容
            </h3>
            <button
              onClick={copyToClipboard}
              className="text-xs text-slate-500 flex items-center gap-1 hover:text-amber-600 bg-white px-2 py-1 rounded border border-slate-200"
            >
              <Copy size={12} />
              複製內容
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full -mr-10 -mt-10"></div>
            <div className="prose prose-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
              AI 生成內容僅供參考，您可以再依據個人情感進行微調。
            </div>
          </div>

          <button
            onClick={() => {
              setResponse("");
              setInput("");
            }}
            className="w-full mt-4 py-3 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
          >
            重新詢問其他問題
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function for Gemini API call with exponential backoff
async function callGeminiWithBackoff(prompt, systemInstruction) {
  const maxRetries = 3;
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "無法生成回應，請稍後再試。"
      );
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

// --- Feature 1: Inflation & Installment Calculator ---
const InflationCalculator = () => {
  const [currentAge, setCurrentAge] = useState(45);
  const [targetAge, setTargetAge] = useState(85);
  const [basePrice, setBasePrice] = useState(259000);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [installmentMode, setInstallmentMode] = useState(true);

  // New state for manual down payment selection
  const [downPayment, setDownPayment] = useState(46000);

  // Auto-sync logic
  useEffect(() => {
    if (basePrice === 259000) setDownPayment(46000); // 分期單買
    if (basePrice === 221000) setDownPayment(24200); // 分期優惠
    if (basePrice === 243000) setDownPayment(243000); // 躉繳單買 (頭款=全額)
    if (basePrice === 211000) setDownPayment(211000); // 躉繳優惠 (頭款=全額)
  }, [basePrice]);

  const years = targetAge - currentAge;
  const futurePrice = Math.round(
    basePrice * Math.pow(1 + inflationRate / 100, years)
  );
  const savings = futurePrice - basePrice;

  // Installment calculations
  const loanAmount = Math.max(0, basePrice - downPayment);
  const isOneTimePayment = basePrice === 243000 || basePrice === 211000;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header Title */}
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-slate-900">資產保值試算</h2>
        <p className="text-slate-500 text-sm mt-1">越早規劃，負擔越輕</p>
      </div>

      {/* Main Display Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <h2 className="text-lg font-bold flex items-center gap-2 text-amber-50">
            {installmentMode ? (
              <Coins size={18} className="text-amber-400" />
            ) : (
              <TrendingUp size={18} className="text-amber-400" />
            )}
            {installmentMode ? "輕鬆分期方案" : "通膨複利試算"}
          </h2>
          <button
            onClick={() => {
              setInstallmentMode(!installmentMode);
              // Switch to default installment price when toggling if needed
              if (
                !installmentMode &&
                ![259000, 221000, 243000, 211000].includes(basePrice)
              ) {
                setBasePrice(259000);
              }
            }}
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 backdrop-blur-sm"
          >
            切換模式
            <ArrowRight size={12} />
          </button>
        </div>

        {installmentMode ? (
          // Installment View
          <div className="space-y-4 animate-fade-in relative z-10">
            {/* 契約總價 Select */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <label className="text-xs text-slate-300 block mb-1">
                契約總價方案
              </label>
              <div className="relative">
                <select
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-slate-800 text-white font-bold text-lg p-2 rounded border border-slate-600 focus:border-amber-500 outline-none appearance-none"
                >
                  <option value={243000}>243,000 元 (躉繳單買一件)</option>
                  <option value={211000}>211,000 元 (躉繳兩件以上)</option>
                  <option value={259000}>259,000 元 (分期單買一件)</option>
                  <option value={221000}>221,000 元 (分期兩件以上)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 頭期款 Display Only (Auto-calculated) */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs text-slate-400 block mb-1">
                  頭期款 / 現金
                </label>
                <div className="text-lg font-bold text-white">
                  {downPayment.toLocaleString()}
                </div>
                {/* Hint for context */}
                <div className="text-[10px] text-amber-400/80 mt-1">
                  {isOneTimePayment
                    ? "(全額付清)"
                    : downPayment === 46000
                    ? "(單件頭款)"
                    : "(優惠頭款)"}
                </div>
              </div>

              {/* 分期總額 Display */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex flex-col justify-center">
                <span className="text-xs text-slate-400 block mb-1">
                  分期餘額
                </span>
                <span className="text-lg font-bold text-white">
                  {loanAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {/* 只顯示 60 期 */}
              {isOneTimePayment ? (
                <div className="flex items-center justify-center p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-bold">
                  🎉 現金一次付清，無後續分期負擔！
                </div>
              ) : (
                <InstallmentRow years={5} amount={loanAmount} highlight />
              )}
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-2">
              *每日成本以月繳金額/30天計算，僅供理財參考
            </p>
          </div>
        ) : (
          // Inflation View
          <div className="space-y-5 animate-fade-in relative z-10">
            <div>
              <label className="text-slate-400 text-xs block mb-1">
                契約總價 (可自行輸入)
              </label>
              <div className="flex items-end gap-2 border-b border-white/20 pb-2">
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) =>
                    setBasePrice(Math.max(0, Number(e.target.value)))
                  }
                  className="bg-transparent text-4xl font-bold text-white w-full focus:outline-none"
                />
                <span className="text-xl text-slate-400 mb-1">元</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="text-right">
                <div className="text-amber-400 text-xs font-medium mb-1">
                  預估 {years} 年後費用 ({inflationRate}%通膨)
                </div>
                <div className="text-3xl font-bold text-amber-400">
                  {futurePrice.toLocaleString()} 元
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 rounded-full p-1.5">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-emerald-200">
                    提早鎖定價格，預計省下
                  </p>
                  <p className="text-xl font-bold text-white">
                    {savings.toLocaleString()} 元
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Sliders (Always visible for better UX) */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-slate-100">
        <div>
          <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
            <span>目前年齡</span>
            <span className="text-amber-600">{currentAge} 歲</span>
          </label>
          <input
            type="range"
            min="20"
            max="90"
            value={currentAge}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentAge(val);
              if (val >= targetAge) setTargetAge(val + 5);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
            <span>預估使用年齡</span>
            <span className="text-amber-600">{targetAge} 歲</span>
          </label>
          <input
            type="range"
            min={currentAge + 1}
            max="100"
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {!installmentMode && (
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>市場通膨率預估</span>
              <span className="text-amber-600">{inflationRate}%</span>
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setInflationRate(rate)}
                  className={`flex-1 py-1 text-sm rounded-md border transition-all ${
                    inflationRate === rate
                      ? "bg-amber-50 border-amber-600 text-amber-700 font-bold shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => window.open(LINE_URL, "_blank")}
          className="text-slate-400 text-xs flex items-center gap-1 hover:text-amber-600 transition-colors"
        >
          <AlertCircle size={12} />
          需要詳細報價單？點此諮詢顧問
        </button>
      </div>
    </div>
  );
};

const InstallmentRow = ({ years, amount, highlight }) => {
  const months = years * 12;
  const monthlyPay = Math.round(amount / months);
  const dailyPay = Math.round(monthlyPay / 30);

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
        highlight
          ? "bg-amber-500/20 border-amber-500/50 scale-[1.02] shadow-sm"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div>
        <div className="font-bold text-white text-lg">
          {years} 年期{" "}
          <span className="text-slate-300 font-normal text-sm">
            ({months}期)
          </span>
        </div>
        <div className="text-xs text-slate-300 mt-1">
          每日只需存約{" "}
          <span className="text-amber-400 font-bold text-sm">{dailyPay}</span>{" "}
          元
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">
          {monthlyPay.toLocaleString()}{" "}
          <span className="text-xs font-normal text-slate-300">元/月</span>
        </div>
      </div>
    </div>
  );
};

// --- Feature 2: Brand Assurance (Trust, Comparison, Values) ---
const BrandAssurance = () => {
  const [subTab, setSubTab] = useState("trust"); // trust, compare, values

  return (
    <div className="animate-fade-in p-4 pb-12">
      <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setSubTab("trust")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            subTab === "trust"
              ? "bg-white text-amber-600 shadow-sm"
              : "text-slate-500"
          }`}
        >
          信託保障
        </button>
        <button
          onClick={() => setSubTab("compare")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            subTab === "compare"
              ? "bg-white text-amber-600 shadow-sm"
              : "text-slate-500"
          }`}
        >
          同業比較
        </button>
        <button
          onClick={() => setSubTab("values")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            subTab === "values"
              ? "bg-white text-amber-600 shadow-sm"
              : "text-slate-500"
          }`}
        >
          核心價值
        </button>
      </div>

      {subTab === "trust" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">75% 信託專戶</h2>
            <p className="text-slate-500 text-sm mt-1">
              您的每一分錢，都受到政府嚴格監管
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-6 text-center text-white relative">
              <Lock size={48} className="mx-auto text-amber-400 mb-3" />
              <h3 className="text-2xl font-bold mb-1">強制信託</h3>
              <p className="text-slate-300 text-sm">殯葬管理條例 第51條規定</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl shrink-0">
                  75%
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  您繳交的費用中，有{" "}
                  <span className="font-bold text-amber-600">75%</span>{" "}
                  必須交付信託業者管理，專款專用，除履約外不得提領。
                </div>
              </div>
              <button
                onClick={() =>
                  window.open(
                    "https://www.trust.org.tw/tw/info/related-common/11",
                    "_blank"
                  )
                }
                className="w-full py-2 border border-slate-300 rounded-lg text-slate-600 text-sm hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Search size={16} />
                查詢內政部信託公告
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} />
              為什麼信託很重要？
            </h4>
            <ul className="text-sm text-amber-900/80 space-y-2 list-disc list-inside">
              <li>避免業者惡性倒閉求償無門</li>
              <li>確保資金不被挪作他用</li>
              <li>連續多年財務公開透明</li>
            </ul>
          </div>
        </div>
      )}

      {subTab === "compare" && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">超級比一比</h2>
            <p className="text-slate-500 text-sm mt-1">
              魔鬼藏在細節裡，別讓便宜變成遺憾
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-left text-slate-500 font-medium">
                    比較項目
                  </th>
                  <th className="p-3 text-center text-amber-600 font-bold bg-amber-50">
                    龍巖集團
                  </th>
                  <th className="p-3 text-center text-slate-500 font-medium">
                    一般業者
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-medium text-slate-700">價格透明度</td>
                  <td className="p-3 text-center bg-amber-50/30 text-emerald-600 font-bold">
                    完全透明
                  </td>
                  <td className="p-3 text-center text-slate-500">
                    常有追加項目
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-700">紅包文化</td>
                  <td className="p-3 text-center bg-amber-50/30 text-emerald-600 font-bold">
                    嚴格禁止
                  </td>
                  <td className="p-3 text-center text-slate-500">潛規則多</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-700">信託保障</td>
                  <td className="p-3 text-center bg-amber-50/30 text-emerald-600 font-bold">
                    75% 信託
                  </td>
                  <td className="p-3 text-center text-slate-500">
                    依內政部公告之商家為準
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-700">服務據點</td>
                  <td className="p-3 text-center bg-amber-50/30 text-emerald-600 font-bold">
                    全台直營
                  </td>
                  <td className="p-3 text-center text-slate-500">區域限制</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-500 leading-relaxed">
            註：市面上有許多低價契約，常在真正履約時加收「洗身費」、「運費」、「冷氣費」等名目，龍巖契約內容白紙黑字，保障您的權益。
          </div>
        </div>
      )}

      {subTab === "values" && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-slate-900">
              為什麼選擇龍巖？
            </h2>
          </div>
          {[
            {
              title: "自主尊嚴",
              desc: "依照自己的意願規劃，不用讓子女在慌亂中猜測，這是一份最後的禮物。",
              icon: <Users className="text-blue-500" />,
            },
            {
              title: "價格鎖定",
              desc: "抵抗通貨膨脹，現在買斷未來服務，費用完全透明，無額外紅包文化。",
              icon: <Shield className="text-emerald-500" />,
            },
            {
              title: "轉讓靈活",
              desc: "契約具備資產屬性，可轉讓給親友使用，或作為傳家資產。",
              icon: <CheckCircle2 className="text-amber-500" />,
            },
            {
              title: "品牌信賴",
              desc: "龍巖為業界領導品牌，信託專戶管理，財務公開透明，保障百分百。",
              icon: <Heart className="text-rose-500" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4"
            >
              <div className="bg-slate-50 p-3 rounded-full shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={() => window.open(LINE_URL, "_blank")}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
        >
          <Phone size={18} />
          了解更多保障細節
        </button>
      </div>
    </div>
  );
};

// --- Feature 3: Service Gallery (Columbarium Gallery) ---
const ServiceGallery = () => {
  // 模擬塔位展示，點擊後可連結至 3D 導覽或地圖 (目前預設為 Google 搜尋)
  const galleryItems = [
    {
      title: "三芝真龍殿",
      tag: "旗艦地標",
      location: "新北市三芝區",
      color: "from-amber-700 to-slate-900",
      icon: <Building size={32} className="text-amber-200" />,
      link: "https://livetour.istaging.com/1e4eee73-656f-460a-8537-177a7fa8b649?group=8ba5abaf-8eeb-444b-8846-eaca634f1c46&index=1",
    },
    {
      title: "三芝白沙灣陵園",
      tag: "山海景觀",
      location: "新北市三芝區",
      color: "from-cyan-800 to-slate-900",
      icon: <Building size={32} className="text-cyan-200" />,
      link: "https://livetour.istaging.com/b9f38657-b701-4e0d-86ac-b09bb53ed3da?group=79778aaa-9d5a-43e4-b327-40d720f72cc0&index=1",
    },
    {
      title: "台中寶山",
      tag: "花園公墓",
      location: "台中市北屯區",
      color: "from-emerald-800 to-slate-900",
      icon: <Building size={32} className="text-emerald-200" />,
      link: "https://livetour.istaging.com/9fd216ab-7c38-40c7-becc-7a2d5ef7c69e?group=150a83e1-0b02-46fb-b4f9-0cac3c364788&index=1",
    },
    {
      title: "嘉義嘉雲寶塔",
      tag: "莊嚴聖地",
      location: "嘉義縣水上鄉",
      color: "from-indigo-800 to-slate-900",
      icon: <Building size={32} className="text-indigo-200" />,
      link: "https://livetour.istaging.com/7b758c12-a213-4938-ae4c-17d7d807097d",
    },
    {
      title: "高雄安泰",
      tag: "風水寶地",
      location: "高雄市大社區",
      color: "from-rose-900 to-slate-900",
      icon: <Building size={32} className="text-rose-200" />,
      link: "https://livetour.istaging.com/255ed923-adf2-45f4-9e76-18a679da8f5e?index=1",
    },
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-slate-900">全省塔位鑑賞</h2>
        <p className="text-slate-500 text-sm mt-1">
          龍巖精選寶地，給家人最好的歸宿
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => window.open(item.link, "_blank")}
            className={`relative overflow-hidden rounded-xl h-48 bg-gradient-to-br ${item.color} shadow-md group cursor-pointer transition-transform hover:scale-[1.02]`}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-white flex items-center gap-1">
              <MapPin size={10} />
              {item.location}
            </div>
            <div className="absolute top-4 left-4 bg-amber-500/90 px-3 py-1 rounded text-xs font-bold text-white shadow-sm">
              {item.tag}
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="mb-2 opacity-90">{item.icon}</div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                {item.title}
              </h3>
              <div className="text-sm mt-2 flex items-center gap-1 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all">
                點擊查看 3D 環景 <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
        <p className="text-sm text-slate-600 mb-3">
          想預約現場參觀或了解塔位價格？
        </p>
        <button
          onClick={() => window.open(LINE_URL, "_blank")}
          className="text-amber-600 font-bold text-sm border-b border-amber-600 pb-0.5 hover:text-amber-700"
        >
          加 LINE 安排專車接送參觀
        </button>
      </div>
    </div>
  );
};

// --- Feature 4: Legacy Checklist ---
const LegacyChecklist = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tasks = [
    { id: 1, text: "決定宗教儀式 (中式/西式/其他)" },
    { id: 2, text: "挑選塔位/墓園地點" },
    { id: 3, text: "準備壽衣/壽服" },
    { id: 4, text: "決定遺照照片" },
    { id: 5, text: "規劃告別式場風格" },
    { id: 6, text: "擬定邀請親友名單" },
    { id: 7, text: "預算規劃與資金準備" },
    { id: 8, text: "法律遺囑與資產分配" },
  ];

  const progress = Object.values(checkedItems).filter(Boolean).length;
  const percentage = Math.round((progress / tasks.length) * 100);

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-slate-900">託付清單</h2>
        <p className="text-slate-500 text-sm mt-1">
          別讓愛與責任，變成家人的負擔
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            繁雜事項完成度
          </h2>
          <div className="text-4xl font-bold text-amber-500 mb-2">
            {percentage}%
          </div>
          <p className="text-slate-500 text-xs mb-4">
            如果沒有事前規劃，這 30+ 項決策
            <br />
            將在家人最悲痛的 48 小時內被迫決定
          </p>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-amber-100 w-full">
          <div
            style={{ width: `${percentage}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleItem(task.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
              checkedItems[task.id]
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-slate-200 hover:border-amber-300"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                checkedItems[task.id]
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-slate-300"
              }`}
            >
              {checkedItems[task.id] && <CheckCircle2 size={16} />}
            </div>
            <span
              className={`text-sm ${
                checkedItems[task.id]
                  ? "text-slate-800 font-medium"
                  : "text-slate-600"
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* NEW: 關懷手冊按鈕 - Enhanced */}
      <div className="mt-6">
        <button
          onClick={() => window.open(MANUAL_URL, "_blank")}
          className="w-full bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-200 p-5 rounded-2xl flex items-center justify-between group hover:border-amber-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-md text-amber-600 ring-2 ring-amber-100 group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-lg mb-1 group-hover:text-amber-800">
                閱讀電子版關懷手冊
              </div>
              <div className="text-sm text-slate-600 font-medium">
                臨終諮詢、禮儀流程完整說明
              </div>
            </div>
          </div>
          <div className="bg-white/80 p-2 rounded-full text-amber-600 shadow-sm group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        </button>
      </div>

      <div className="bg-slate-800 text-white p-5 rounded-xl mt-4">
        <h3 className="font-bold text-lg mb-2">交給專業，一站搞定</h3>
        <p className="text-slate-300 text-sm mb-4">
          龍巖生前契約已包含上述 80% 的繁瑣細節。
        </p>
        <button
          onClick={() => window.open(LINE_URL, "_blank")}
          className="w-full bg-white text-slate-900 font-bold py-2 rounded shadow-sm hover:bg-slate-100 transition-colors"
        >
          立即預約諮詢
        </button>
      </div>
    </div>
  );
};

export default App;

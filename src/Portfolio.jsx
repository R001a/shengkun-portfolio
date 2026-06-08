import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, Workflow, Layers, MonitorPlay, Code2, 
  Lightbulb, ChevronRight, Mail, Phone, Cpu, 
  Sparkles, Box, Database, Image as ImageIcon, Video, Palette, Target, Search, Zap, LayoutTemplate, PenTool, Aperture, Fingerprint
} from 'lucide-react';

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    html, body, #root {
      background-color: #050505 !important;
      color: #e5e7eb !important;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #050505; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
    
    .text-hollow {
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
      color: transparent;
    }
    .glass-card {
      background: linear-gradient(145deg, rgba(167,139,250,0.022), rgba(255,255,255,0.014));
      border: 1px solid rgba(255, 255, 255, 0.068);
      box-shadow: 0 14px 38px rgba(0,0,0,0.16), inset 0 1px 0 rgba(167,139,250,0.018);
    }
    [data-portfolio-root="true"] p {
      color: #d1d5db;
      font-size: 15px;
      line-height: 1.9;
    }
    [data-portfolio-root="true"] .text-sm {
      font-size: 15px;
    }
    [data-portfolio-root="true"] .text-xs {
      font-size: 13px;
    }
    [data-portfolio-root="true"] h3 {
      line-height: 1.35;
    }
    .edit-toolbar {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9999;
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px;
      background: rgba(8,8,10,0.86);
      backdrop-filter: blur(18px);
      box-shadow: 0 18px 60px rgba(0,0,0,0.42);
    }
    .edit-toolbar button {
      min-height: 34px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 0 12px;
      color: #e5e7eb;
      background: rgba(255,255,255,0.05);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .edit-toolbar button.primary {
      color: #050505;
      border-color: #a78bfa;
      background: #a78bfa;
    }
    .edit-toolbar .edit-status {
      color: #9ca3af;
      font-size: 12px;
      white-space: nowrap;
    }
    [data-edit-mode="true"] [contenteditable="true"] {
      outline: 1px dashed rgba(167,139,250,0.45);
      outline-offset: 3px;
      border-radius: 4px;
      cursor: text;
    }
    [data-edit-mode="true"] [contenteditable="true"]:focus {
      outline: 2px solid rgba(167,139,250,0.86);
      background: rgba(167,139,250,0.08);
    }
    [data-edit-mode="true"] [data-media-label],
    [data-edit-mode="true"] a {
      cursor: text !important;
    }
    .media-preview-modal {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 28px;
      background: rgba(0,0,0,0.82);
      backdrop-filter: blur(18px);
    }
  `}} />
);

// ================= 数据配置区 =================

const NAV_LINKS = [
  { name: '首页', href: '#hero' },
  { name: '履历', href: '#experience' },
  { name: '能力地图', href: '#capabilities' },
  { name: '核心案例', href: '#cases-overview' },
  { name: '传统视觉', href: '#traditional-assets' },
  { name: '方法论', href: '#methodology' },
];

const SKILL_TAGS = [
  'Codex', 'OpenClaw', 'Coze', 'Prompt Engineering', 'AI写真特效', 
  'AI TVC视频', 'AI短视频'
];

const CAREER_PATH = [
  { company: '安徽贝慕影视传媒', role: '联合创办人', time: '2016.04 - 2019.03', active: false },
  { company: 'BILIBILI 设计中心', role: '创意设计师', time: '2019.03 - 2022.12', active: false },
  { company: '米哈游 MiHoYo', role: '创意设计师', time: '2022.12 - 2024.02', active: false },
  { company: '字节跳动 ByteDance', role: 'AIGC动效 / AI视觉工作流', time: '2024.03 - 至今', active: true },
];

const EXPERIENCES = [
  {
    company: '字节跳动 ByteDance',
    time: '2024.03 — 至今',
    role: 'AIGC动效设计师 / AI视觉工作流设计师',
    desc: '负责电商大促及平台业务中的 AIGC 内容生产、AI动效设计、AI特效内容探索与智能体工作流建设，同时持续参与传统动效、TVC、3D电商动画和营销大促动态内容产出。',
    highlights: [
      '负责 AI写真特效与 AI电商内容生成，支持平台活动、营销视觉和玩法探索。',
      '参与 AI 短视频、长视频、TVC、KV、AI写真、博物馆奇妙夜等内容生成项目。',
      '负责电商业务中的传统动效与 TVC 视觉产出，参与营销大促、活动会场、弹窗、KV 动画等多类型动效设计。',
      '参与并统筹 618、中秋节等大促业务动效设计产出，覆盖活动主视觉动态化、会场动效、弹窗动画、KV 动画与营销视频内容。',
      '负责 3D 电商动画与营销大促团队年度 Showreel 制作，沉淀电商业务中的三维视觉、动效包装。',
      '基于 Coze 搭建轻量级智能体，将生鲜、3C、服饰等品类风格拆解为可复用 Prompt 结构。',
      '使用 OpenClaw 制作特效提示词反推工具，将图像识别、维度拆解、权重判断封装为网页工具。',
      '持续组织和参与内部 AI 工具培训，推动团队 AI 能力沉淀和流程标准化。'
    ]
  },
  {
    company: '米哈游 MiHoYo',
    time: '2022.12 — 2024.02',
    role: '创意设计师',
    desc: '负责品牌 IP 建立和迭代、3D资产库搭建、周边衍生品制作与动效支持。参与米游姬 / 米游兔等 IP 视觉资产建设，积累三维视觉、角色资产、IP延展和动效包装经验。期间开始接触 Stable Diffusion 等 AI 工具，并用于创意提案与视觉探索。',
    highlights: ['品牌 IP 建立与迭代', '3D资产库搭建', '周边衍生品制作', '动效支持', 'AI工具早期探索']
  },
  {
    company: 'BILIBILI 设计中心',
    time: '2019.03 — 2022.12',
    role: '创意设计师',
    desc: '负责 B站品牌 IP 三维图库搭建、规范迭代、大型活动视觉支持和动效包装。参与最美的夜、BML、PowerUp、百大 UP 主等项目的三维视觉与动效支持，积累大型活动包装、IP资产建设、三维场景和动效交付经验。',
    highlights: ['IP三维资产库搭建', '大型活动视觉支持', '动效包装', '三维场景与空间视觉', '品牌活动项目交付']
  }
];

const CAPABILITIES = [
  { 
    num: '01', title: '智能体能力', icon: <Cpu size={24}/>, 
    content: ['Coze', 'OpenClaw', 'Codex', 'Prompt Engineering'], 
    cases: 'Coze会场/凑单页/摆盘智能体、OpenClaw反推、Codex自动化',
    slogan: '将 AI 能力封装为业务和团队可直接使用的智能体工具。'
  },
  { 
    num: '02', title: '业务工作流', icon: <Workflow size={24}/>, 
    content: ['关键词裂变', '素材采集', '热点搜集', '方案生成'], 
    cases: 'Codex特效全链路自动化、热点自动搜集工作流',
    slogan: '将复杂业务拆解为可执行、可复用、可交付的 AI 工作流。'
  },
  { 
    num: '03', title: 'AI内容生产', icon: <MonitorPlay size={24}/>, 
    content: ['AI写真', 'AI视频/TVC', 'AI KV', 'AI长/短视频'], 
    cases: 'AI写真特效、AI完整TVC、KV海报、博物馆奇妙夜',
    slogan: '从单张视觉到完整项目，完成商业化 AI 内容大批量生产。'
  },
  { 
    num: '04', title: '团队赋能', icon: <Lightbulb size={24}/>, 
    content: ['内部培训', '工具分享', '方法论文档', '流程推广'], 
    cases: '2025-2026 AI工具分享体系、AI/软件/组合应用培训',
    slogan: '将个人经验沉淀为团队方法论，推动 AI 成为团队核心能力。'
  },
  { 
    num: '05', title: '传统设计技能', icon: <Layers size={24}/>, 
    content: ['三维视觉', '2D/3D动效', 'IP与包装', '电商大促动效'], 
    cases: '电商动效与TVC业务、3D Showreel、3D IP BDC、大型项目支持',
    slogan: '传统技能是我进行 AI 生产、镜头判断、商业落地判断的底层基础。'
  }
];

const OVERVIEW_CASES = [
  {
    title: '1. AI Agent 工作流设计',
    tools: 'Codex / OpenClaw',
    desc: '将复杂业务流程拆解为可执行、可复用、可交付的 AI Agent 工作流，并打通从选题策略到制作落地的上下游链路。',
    tags: ['全链路自动化', '素材采集', '热点搜集', '提示词反推', '上下游打通'],
    isMain: true
  },
  {
    title: '2. 轻量级智能体业务赋能',
    tools: 'Coze',
    desc: '让非设计人员也能通过智能体完成日常会场配图、图标生成、摆盘等轻量内容生产。',
    tags: ['会场配图', '凑单页图标', '摆盘', '运营提效', '品类Prompt'],
    isMain: false
  },
  {
    title: '3. AI内容生成完整项目',
    tools: 'Midjourney / SD / Sora / ComfyUI / Lovart',
    desc: '从创意、脚本、分镜到视频成片与商业视觉输出的完整 AI 内容生产能力。',
    tags: ['AI视频', '长短视频', 'AI TVC', 'KV', '海报', 'AI写真'],
    isMain: false
  },
  {
    title: '4. 传统视觉动效与三维资产',
    tools: 'C4D / After Effects / Blender',
    desc: '长期传统设计、三维视觉和动效经验，是 AI 内容生产的专业基础，也是稳定商业交付的保障。',
    tags: ['字节跳动电商动效与TVC', '3D电商动画', '3D IP', '大型项目支持'],
    isMain: false
  }
];

// ================= 组件区 =================

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SectionTitle = ({ title, subtitle, desc, centered = false }) => (
  <div className={`mb-16 ${centered ? 'flex flex-col items-center text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white mb-3">{title}</h2>
    {subtitle && <p className="text-[#a78bfa] text-sm tracking-widest uppercase font-mono">{subtitle}</p>}
    <div className={`h-px w-20 bg-gradient-to-r from-[#8b5cf6] to-transparent mt-5 ${centered ? 'mx-auto' : ''}`}></div>
    {desc && <p className="text-gray-400 text-sm max-w-4xl leading-relaxed mt-6">{desc}</p>}
  </div>
);

function mediaSrcFromLabel(label = "") {
  const match = label.match(/assets\/[^\s]+/);
  return match ? assetUrl(match[0]) : "";
}

function assetUrl(path = "") {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function openMediaPreview({ label, src = "", type = "image" }) {
  if (document.body.dataset.editMode === 'true') return;
  window.dispatchEvent(new CustomEvent('portfolio-media-preview', {
    detail: { label, src: src || mediaSrcFromLabel(label), type }
  }));
}

const ImagePlaceholder = ({ label, className = "", icon, src, type = "image" }) => {
  const content = useContext(PortfolioContentContext);
  const override = content.media?.[label];
  const inferredType = /视频|录屏|showreel|tvc|\.mp4|\.mov|\.webm/i.test(label) ? 'video' : type;
  const effectiveSrc = override?.src || assetUrl(src);
  const effectiveType = override?.type || inferredType;
  return (
      <div
        className={`glass-card flex flex-col items-center justify-center rounded-xl overflow-visible relative group mb-12 cursor-zoom-in transition-all duration-300 border-[#8b5cf6]/12 bg-[#06060a]/55 hover:border-[#8b5cf6]/32 hover:bg-[#8b5cf6]/[0.024] hover:shadow-[0_0_22px_rgba(139,92,246,0.10)] ${className}`}
        role="button"
        tabIndex={0}
        data-media-label={label}
        onClick={() => openMediaPreview({ label, src: effectiveSrc, type: effectiveType })}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openMediaPreview({ label, src: effectiveSrc, type: effectiveType });
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {effectiveSrc ? (
          effectiveType === 'video' ? (
            <video src={effectiveSrc} className="absolute inset-0 h-full w-full rounded-xl object-cover opacity-90" muted playsInline preload="metadata" />
          ) : (
            <img src={effectiveSrc} alt={label} className="absolute inset-0 h-full w-full rounded-xl object-cover opacity-90" loading="lazy" />
          )
        ) : icon && (
          <div className="text-gray-600 group-hover:text-[#a78bfa]/50 transition-colors duration-300 z-10">
            {icon}
          </div>
        )}
        {effectiveType === 'video' && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-black/35 shadow-[0_0_24px_rgba(0,0,0,0.45)]">
              <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white/90"></div>
            </div>
          </div>
        )}
        <div className="absolute left-0 right-0 -bottom-7 z-10 px-2">
          <span className="block text-gray-500 text-xs tracking-wider text-center leading-relaxed font-medium">{label}</span>
        </div>
      </div>
  );
};

const SkillEvidenceCard = ({ number, title, desc, src, large = false, showTags = true }) => {
  const effectiveSrc = assetUrl(src);
  return (
  <div className={`relative glass-card rounded-2xl overflow-hidden bg-[#05070b]/72 border-[#4f46e5]/15 shadow-[0_0_22px_rgba(79,70,229,0.05)] transition-all duration-300 hover:border-[#8b5cf6]/35 hover:bg-[#111122]/55 hover:shadow-[0_0_26px_rgba(139,92,246,0.12)] ${large ? 'p-5 h-[475px]' : 'p-4 h-[226px]'}`}>
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.08),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.06),transparent_30%)]"></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className={`${large ? 'mb-4' : 'mb-3'}`}>
        <h5 className={`${large ? 'text-2xl' : 'text-base'} font-semibold text-white tracking-tight`}>
          <span className="text-[#818cf8] font-mono mr-2">{number}</span>{title}
        </h5>
        <p className={`${large ? 'text-sm' : 'text-[11px]'} text-gray-500 leading-relaxed mt-2 line-clamp-2`}>{desc}</p>
      </div>
      <div
        className={`relative rounded-xl border border-white/10 bg-[#020617] overflow-hidden cursor-zoom-in transition-colors duration-300 hover:border-[#8b5cf6]/40 ${large ? 'flex-1 min-h-0' : showTags ? 'h-[82px]' : 'flex-1 min-h-[104px] mb-1'}`}
        role="button"
        tabIndex={0}
        onClick={() => openMediaPreview({ label: `${number} ${title}`, src: effectiveSrc })}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openMediaPreview({ label: `${number} ${title}`, src: effectiveSrc });
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-white/[0.04] border-b border-white/10 flex items-center justify-between px-4 z-10">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Evidence Preview / Skill Screenshot</span>
        </div>
        <img src={effectiveSrc} alt={`${number} ${title}`} className="w-full h-full object-cover pt-8 opacity-90" loading="lazy" />
      </div>
      {showTags && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {['已结构化', '可追踪', '可复用', '已跑通'].map((tag) => (
            <span key={tag} className="px-2 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-gray-300 text-center font-medium">{tag}</span>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

// 流程图节点组件
const FlowNode = ({ text, isLast = false, highlight = false }) => (
  <div className="flex items-center shrink-0 my-2">
    <div className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors border 
      ${highlight ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/50 text-[#a78bfa]' : 'bg-[#0a0a0a] border-white/10 text-gray-300 hover:border-[#8b5cf6]/40'}`}>
      {text}
    </div>
    {!isLast && <ArrowRight className="mx-2 md:mx-3 text-gray-600 w-4 h-4 shrink-0" />}
  </div>
);

// ✨ AI Agent 工作流轨道动画
const HeroAnimation = () => (
  <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
    {/* 背景发光 */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-64 h-64 bg-[#8b5cf6]/20 rounded-full blur-[80px]"
    />
    
    {/* 外圈轨道 */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute w-[400px] h-[400px] border border-white/5 rounded-full border-dashed"
    />
    
    {/* 内圈轨道 */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute w-[260px] h-[260px] border border-[#8b5cf6]/20 rounded-full"
    />
    
    {/* 中心节点 */}
    <div className="absolute w-20 h-20 bg-[#8b5cf6]/20 rounded-2xl border border-[#8b5cf6]/50 flex items-center justify-center backdrop-blur-xl z-20 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
      <Sparkles className="text-[#a78bfa] w-8 h-8" />
    </div>
    
    {/* 外圈游离节点 */}
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-[400px] h-[400px] z-10">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-xl flex items-center shadow-lg"><span className="text-xs text-gray-300 font-mono">Codex</span></div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-xl flex items-center shadow-lg"><span className="text-xs text-gray-300 font-mono">OpenClaw</span></div>
      <div className="absolute top-1/2 -left-6 -translate-y-1/2 glass-card px-4 py-2 rounded-xl flex items-center shadow-lg"><span className="text-xs text-gray-300 font-mono">TVC</span></div>
    </motion.div>

    {/* 内圈游离节点 */}
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-[260px] h-[260px] z-10">
      <div className="absolute top-1/2 -left-6 -translate-y-1/2 glass-card px-3 py-1.5 rounded-lg flex items-center"><span className="text-[10px] text-[#a78bfa]">Motion</span></div>
      <div className="absolute top-1/2 -right-6 -translate-y-1/2 glass-card px-3 py-1.5 rounded-lg flex items-center"><span className="text-[10px] text-[#a78bfa]">Coze</span></div>
    </motion.div>
  </div>
);

// ================= 主页面 =================

const EDIT_DRAFT_KEY = 'shengkun-portfolio-text-draft-v2';
const PORTFOLIO_CONTENT_URL = assetUrl('content/portfolio-content.json');
const PortfolioContentContext = createContext({ media: {}, text: {} });

function getEditableTextKey(el, occurrence) {
  const text = el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || 'text';
  return `${el.tagName.toLowerCase()}-${text}-${occurrence}`;
}

function getEditableTextNodes() {
  const root = document.querySelector('[data-portfolio-root="true"]');
  if (!root) return [];
  const candidates = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,li,button,div'))
    .filter((el) => {
      if (el.closest('.edit-toolbar')) return false;
      if (el.closest('.media-preview-modal')) return false;
      if (el.closest('svg')) return false;
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) return false;
      const text = el.textContent?.trim();
      if (!text) return false;
      const directText = Array.from(el.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      const elementChildren = Array.from(el.children).filter((child) => child.tagName !== 'BR');
      if (el.tagName === 'DIV' && elementChildren.length > 0 && !directText) return false;
      if (elementChildren.length > 0 && !directText && !['A', 'BUTTON', 'LI'].includes(el.tagName)) return false;
      return true;
    });
  const nodes = candidates.filter((el) => !candidates.some((parent) => parent !== el && parent.contains(el)));
  const counts = new Map();
  nodes.forEach((el) => {
    if (el.dataset.editKey) return;
    const base = el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || 'text';
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    el.dataset.editKey = getEditableTextKey(el, count);
  });
  return nodes;
}

async function loadPortfolioContent() {
  try {
    const response = await fetch(`${PORTFOLIO_CONTENT_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return { media: {}, text: {} };
    return await response.json();
  } catch {
    return { media: {}, text: {} };
  }
}

function EditModeControls() {
  const content = useContext(PortfolioContentContext);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('草稿未保存');

  useEffect(() => {
    try {
      if (editing) return;
      const localDraft = localStorage.getItem(EDIT_DRAFT_KEY);
      const values = content.text && Object.keys(content.text).length
        ? content.text
        : localDraft
          ? JSON.parse(localDraft)
          : null;
      if (!values) return;
      getEditableTextNodes().forEach((el, index) => {
        const key = el.dataset.editKey;
        if (Array.isArray(values) && values[index] !== undefined) el.innerHTML = values[index];
        if (!Array.isArray(values) && key && values[key] !== undefined) el.innerHTML = values[key];
      });
      setStatus(content.text && Object.keys(content.text).length ? '已加载后台文字' : '已加载本机草稿');
    } catch {
      setStatus('草稿读取失败');
    }
  }, [content.text, editing]);

  useEffect(() => {
    getEditableTextNodes().forEach((el) => {
      if (editing) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
      }
    });
    document.body.dataset.editMode = editing ? 'true' : 'false';
  }, [editing]);

  useEffect(() => {
    const preventInteractiveClickWhileEditing = (event) => {
      if (document.body.dataset.editMode !== 'true') return;
      if (event.target.closest('.edit-toolbar')) return;
      const link = event.target.closest('[data-portfolio-root="true"] a');
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
    };
    document.addEventListener('click', preventInteractiveClickWhileEditing, true);
    return () => document.removeEventListener('click', preventInteractiveClickWhileEditing, true);
  }, []);

  const saveDraft = async () => {
    const values = {};
    getEditableTextNodes().forEach((el) => {
      if (el.dataset.editKey) values[el.dataset.editKey] = el.innerHTML;
    });
    localStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify(values));
    setStatus(`已保存本机草稿 ${Object.keys(values).length} 处`);
    try {
      const response = await fetch('/api/content/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: values }),
      });
      if (response.ok) setStatus(`已保存到后台 ${Object.keys(values).length} 处`);
    } catch {
      setStatus('已保存本机草稿，后台未连接');
    }
  };

  const clearDraft = async () => {
    localStorage.removeItem(EDIT_DRAFT_KEY);
    try {
      await fetch('/api/content/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: {} }),
      });
    } catch {}
    setStatus('草稿已清空，刷新恢复默认');
  };

  return (
    <div className="edit-toolbar" aria-label="编辑工具">
      <button className={editing ? 'primary' : ''} type="button" onClick={() => setEditing(!editing)}>
        {editing ? '退出编辑' : '编辑文字'}
      </button>
      <button type="button" onClick={saveDraft}>保存文字</button>
      <button type="button" onClick={clearDraft}>清空草稿</button>
      <span className="edit-status">{status}</span>
    </div>
  );
}
function MediaPreviewModal() {
  const [media, setMedia] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const open = (event) => {
      setMedia(event.detail);
      setZoomed(false);
      setFailed(false);
    };
    window.addEventListener('portfolio-media-preview', open);
    return () => window.removeEventListener('portfolio-media-preview', open);
  }, []);

  useEffect(() => {
    if (!media) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMedia(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [media]);

  if (!media) return null;

  const hasImage = media.src && !failed;
  const isVideo = media.type === 'video' || /\.(mp4|webm|mov)$/i.test(media.src || "");

  return (
    <div className="media-preview-modal" onClick={() => setMedia(null)}>
      <div className={`relative w-full ${zoomed ? 'max-w-[96vw]' : 'max-w-[86vw]'} max-h-[92vh]`} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-white font-bold text-sm md:text-base truncate">{media.label}</div>
          <div className="flex gap-2">
            <button type="button" className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white hover:bg-white/15" onClick={() => setZoomed(!zoomed)}>
              {zoomed ? '还原' : '放大'}
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white hover:bg-white/15" onClick={() => setMedia(null)}>
              关闭
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#050505] overflow-auto max-h-[84vh] shadow-[0_28px_90px_rgba(0,0,0,0.72)]">
          {hasImage && isVideo ? (
            <video
              src={media.src}
              controls
              className={`${zoomed ? 'w-auto max-w-none max-h-none' : 'w-full max-h-[82vh]'} object-contain mx-auto`}
              onError={() => setFailed(true)}
            />
          ) : hasImage ? (
            <img
              src={media.src}
              alt={media.label}
              className={`${zoomed ? 'w-auto max-w-none max-h-none' : 'w-full max-h-[82vh]'} object-contain mx-auto cursor-zoom-in`}
              onClick={() => setZoomed(!zoomed)}
              onError={() => setFailed(true)}
            />
          ) : (
            <div className={`${zoomed ? 'min-h-[82vh]' : 'min-h-[62vh]'} flex flex-col items-center justify-center p-10 text-center`}>
              <ImageIcon className="w-14 h-14 text-[#8b5cf6] mb-5" />
              <div className="text-white font-bold mb-2">{media.label}</div>
              <div className="text-gray-500 text-sm max-w-xl">当前还是占位模块，接入真实图片或视频地址后会在这里显示原图/视频。</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [content, setContent] = useState({ media: {}, text: {} });

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const nextContent = await loadPortfolioContent();
      if (active) setContent((currentContent) => ({
        media: nextContent.media || {},
        text: document.body.dataset.editMode === 'true' ? currentContent.text : (nextContent.text || {}),
      }));
    };
    refresh();
    const timer = window.setInterval(refresh, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <PortfolioContentContext.Provider value={content}>
    <div data-portfolio-root="true" className="font-sans text-gray-200 min-h-screen pb-24 selection:bg-[#8b5cf6] selection:text-white" style={{ backgroundColor: '#050505' }}>
      <CustomStyles />
      <EditModeControls />
      <MediaPreviewModal />
      
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1660px] mx-auto px-0 h-16 flex items-center justify-between">
          <div className="font-black tracking-widest text-lg text-white flex items-center gap-1">
            SHENGKUN<span className="text-[#8b5cf6]">.</span>
          </div>
          <div className="hidden lg:flex space-x-6 text-[13px] text-gray-400 font-medium">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1660px] mx-auto px-0 pt-24 space-y-44">
        
        {/* ================= 01. Hero 区 ================= */}
        <section id="hero" className="min-h-[62vh] flex items-center pt-8">
          <div className="grid lg:grid-cols-12 gap-14 items-center w-full">
            <FadeIn className="lg:col-span-7">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">盛坤</h1>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <h2 className="text-xl md:text-2xl text-[#a78bfa] font-light tracking-widest">
                  AI视觉工作流设计师
                </h2>
                <span className="hidden md:block w-px h-5 bg-gray-800"></span>
                <span className="text-sm md:text-base text-gray-500 uppercase tracking-widest font-mono">
                  AI Creative Workflow Designer
                </span>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
                我是一名 AI内容生产与工作流设计者，具备传统设计、三维视觉、2D/3D动效、TVC、IP资产与活动包装经验。当前主要聚焦 AI写真特效、AI视频/TVC、Prompt Engineering、Coze智能体、OpenClaw 与 Codex复杂工作流，同时持续承担电商大促、会场、弹窗、KV动画、TVC与3D电商动画等传统动效业务。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-12 max-w-2xl">
                {SKILL_TAGS.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 glass-card rounded-md text-xs text-gray-400 hover:text-white hover:border-[#8b5cf6]/50 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {[
                  { t: 'AI内容生产', e: 'Content Production' },
                  { t: '工作流搭建', e: 'Workflow Building' },
                  { t: '传统动效交付', e: 'Motion Delivery' },
                  { t: '方案交付', e: 'Deliverables' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl glass-card hover:border-[#8b5cf6]/40 transition-colors group">
                    <div className="text-white text-sm font-bold mb-1">{item.t}</div>
                    <div className="text-gray-600 text-[10px] uppercase tracking-wider">{item.e}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8">
                <a href="mailto:rocksheng001@gmail.com" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center mr-3 group-hover:bg-[#a78bfa]/20 transition-colors">
                    <Mail size={16} className="text-[#a78bfa]" />
                  </div>
                  <span className="font-mono">rocksheng001@gmail.com</span>
                </a>
                <a href="tel:+8618255383506" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center mr-3 group-hover:bg-[#a78bfa]/20 transition-colors">
                    <Phone size={16} className="text-[#a78bfa]" />
                  </div>
                  <span className="font-mono">+86 182 5538 3506</span>
                </a>
              </div>
            </FadeIn>
            
            {/* 右侧抽象 AI 工作流节点/网络图动画 */}
            <FadeIn delay={0.2} className="hidden lg:flex lg:col-span-5 justify-center relative">
               <HeroAnimation />
            </FadeIn>
          </div>
        </section>

        {/* ================= 03. 职业路径 ================= */}
        <section className="-mt-56">
          <SectionTitle title="职业路径" subtitle="Career Path" />
          <FadeIn className="w-full overflow-x-auto pb-4">
            <div className="flex min-w-[900px] pt-4 items-center">
              {CAREER_PATH.map((node, idx) => (
                <div key={idx} className={`flex-1 relative group pr-4 ${node.active ? '' : 'opacity-70'}`}>
                  <div className={`text-xs font-mono mb-3 ${node.active ? 'text-[#a78bfa]' : 'text-gray-500'}`}>{node.time}</div>
                  <div className="relative h-px bg-white/10 w-full mb-5">
                    <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10
                      ${node.active ? 'bg-[#8b5cf6] border-white shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'bg-[#050505] border-gray-600'}`}>
                    </div>
                  </div>
                  <h4 className={`font-bold text-sm mb-1 ${node.active ? 'text-white' : 'text-gray-400'}`}>{node.company}</h4>
                  <p className="text-gray-500 text-xs">{node.role}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-8">从早期影视传媒与视觉设计，到 B站三维动效与 IP 资产，再到米哈游品牌 IP 与 3D资产，最终转向字节跳动电商 AIGC 内容生产、传统大促动效与 AI 工作流设计。</p>
          </FadeIn>
        </section>

        {/* ================= 04. 工作履历 ================= */}
        <section id="experience" className="mt-32">
          <SectionTitle title="工作履历" subtitle="Experience" />
          <div className="space-y-6">
            
            {/* 字节跳动 (核心展开) */}
            <FadeIn>
              <div className="glass-card p-8 md:p-10 rounded-2xl border-[#8b5cf6]/30 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-white/10 pb-6 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">{EXPERIENCES[0].company}</h3>
                    <div className="text-[#a78bfa] font-bold tracking-wide">{EXPERIENCES[0].role}</div>
                  </div>
                  <div className="text-[#a78bfa] text-sm font-mono mt-4 md:mt-0 bg-[#8b5cf6]/10 px-5 py-2 rounded-full border border-[#8b5cf6]/30 shadow-sm">{EXPERIENCES[0].time}</div>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-8 font-medium relative z-10">{EXPERIENCES[0].desc}</p>
                
                {/* Highlight text columns */}
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 relative z-10">
                  {EXPERIENCES[0].highlights.map((item, i) => (
                    <div key={i} className="text-gray-400 text-sm flex items-start">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#8b5cf6] shrink-0 mr-2" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                {/* 数据 / 亮点卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
                   {[
                     'Codex+OpenClaw 上下游闭环',
                     'AI生产+方法论培训并行',
                     '3D电商动画与年度Showreel',
                     '电商大促和品宣动效交付'
                   ].map((hl, i) => (
                     <div key={i} className="bg-[#050505]/60 border border-white/10 rounded-lg p-3 text-xs text-gray-300 text-center font-medium">
                       {hl}
                     </div>
                   ))}
                </div>
              </div>
            </FadeIn>

            {/* 米哈游 / Bilibili */}
            <div className="grid md:grid-cols-2 gap-8">
              {EXPERIENCES.slice(1, 3).map((exp, idx) => (
                <FadeIn key={idx} delay={0.1}>
                  <div className="glass-card p-10 rounded-2xl hover:border-gray-700 transition-colors h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.company}</h3>
                        <div className="text-gray-400 text-xs">{exp.role}</div>
                      </div>
                      <div className="text-gray-500 text-xs font-mono">{exp.time}</div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{exp.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map(h => <span key={h} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500">{h}</span>)}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* 安徽贝慕简要卡片 */}
            <FadeIn delay={0.2}>
              <div className="glass-card p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                 <div>
                   <h4 className="text-white font-bold text-sm mb-1">安徽贝慕影视传媒</h4>
                   <div className="text-gray-400 text-xs">联合创办人 <span className="mx-2">|</span> 作为早期职业阶段，积累项目统筹、视觉执行和团队协作经验。</div>
                 </div>
                 <div className="text-gray-500 text-xs font-mono mt-2 md:mt-0">2016.04 — 2019.03</div>
              </div>
            </FadeIn>

            {/* 荣誉奖项 */}
            <FadeIn delay={0.3} className="mt-8">
               <h4 className="text-sm font-bold text-white mb-4 flex items-center"><Zap className="w-4 h-4 text-[#a78bfa] mr-2"/>荣誉奖项</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {[
                   '字节跳动电商 AI 方向 / 创新之星', '字节跳动电商大促动效项目奖项', 'Bilibili 公司级优秀员工', '后续替换为真实其他奖项'
                 ].map((award, i) => (
                   <div key={i} className="glass-card p-4 rounded-xl text-xs text-gray-400 border-l-2 border-l-[#8b5cf6]">{award}</div>
                 ))}
               </div>
            </FadeIn>
          </div>
        </section>

        {/* ================= 05. 能力地图 (单排展示) ================= */}
        <section id="capabilities" className="mt-32">
          <SectionTitle 
            title="能力地图" 
            subtitle="Capability Map" 
            desc="从智能体能力、业务工作流到 AI 内容生成，再到团队赋能与传统设计技能，形成面向业务落地的复合型 AI 内容生产能力结构。" 
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CAPABILITIES.map((cap, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className={`h-full glass-card p-5 rounded-xl transition-all duration-300 group relative overflow-hidden flex flex-col
                  ${idx === 0 ? 'border-[#8b5cf6]/40 bg-[#8b5cf6]/[0.02]' : 'hover:border-[#a78bfa]/30 hover:bg-white/[0.04]'}`}>
                  
                  <div className={`absolute -top-3 -right-2 text-6xl font-black text-hollow select-none transition-all duration-500 pointer-events-none
                    ${idx === 0 ? 'opacity-30 text-[#8b5cf6]/10' : 'opacity-20 group-hover:scale-110 group-hover:text-[#a78bfa]/10'}`}>
                    {cap.num}
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 shadow-lg transition-colors
                      ${idx === 0 ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 text-[#a78bfa]' : 'bg-[#0a0a0a] border border-[#222] text-gray-300 group-hover:text-[#a78bfa] group-hover:border-[#8b5cf6]/50'}`}>
                      {cap.icon}
                    </div>
                    <h3 className="text-base font-bold text-white mb-3">{cap.title}</h3>
                    
                    <div className="mb-4 grid grid-cols-2 gap-2 content-start">
                      {cap.content.map(c => <span key={c} className="text-[10px] text-gray-400 bg-[#050505] border border-white/5 px-1 py-1.5 rounded-md text-center truncate">{c}</span>)}
                    </div>
                    
                    <div className="text-[10px] text-gray-500 pt-3 border-t border-white/5 mt-auto">
                      <span className="text-gray-600 block mb-1 uppercase tracking-widest font-mono">代表经验</span>
                      <span className="text-gray-400 leading-snug block line-clamp-2">{cap.cases}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ================= 06. 核心案例总览 ================= */}
        <section id="cases-overview" className="mt-32">
          <SectionTitle title="核心案例总览" subtitle="Cases Overview" centered={true} />
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn className="glass-card p-10 rounded-3xl group transition-colors relative overflow-hidden md:col-span-3 border-[#8b5cf6]/40 hover:border-[#8b5cf6]/60">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] text-xs rounded-full mb-6 font-mono">Main Case / 核心案例</div>
              
              <h3 className="text-3xl font-black text-white mb-3 relative z-10">1. AI Agent 工作流设计</h3>
              <p className="text-gray-500 text-xs mb-4 font-mono relative z-10">代表工具：Codex / OpenClaw</p>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed relative z-10 max-w-4xl">证明能力：将复杂业务流程拆解为可执行、可复用、可交付的 AI Agent 工作流，并打通从选题策略到制作落地的上下游链路。</p>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {['全链路自动化', '素材采集', '热点搜集', '提示词反推', '上下游打通'].map(tag => <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-white/5 rounded text-gray-400">{tag}</span>)}
              </div>
            </FadeIn>

            {[
              {
                title: '2. 轻量级智能体业务赋能', tools: 'Coze',
                desc: '让非设计人员也能通过智能体完成日常会场配图、图标生成、摆盘等轻量内容生产。',
                tags: ['会场配图', '凑单页图标', '摆盘', '运营提效', '品类Prompt']
              },
              {
                title: '3. AI内容生成完整项目', tools: 'Midjourney / SD / Sora / ComfyUI / Lovart',
                desc: '从创意、脚本、分镜到视频成片与商业视觉输出的完整 AI 内容生产能力。',
                tags: ['AI视频', '长短视频', 'AI TVC', 'KV', '海报', 'AI写真']
              },
              {
                title: '4. 传统视觉动效与三维资产', tools: 'C4D / After Effects / Blender',
                desc: '长期传统设计、三维视觉和动效经验，是 AI 内容生产的专业基础，也是稳定商业交付的保障。',
                tags: ['字节跳动电商动效与TVC', '3D电商动画', '3D IP', '大型项目支持']
              }
            ].map((caseItem, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="glass-card p-10 rounded-3xl group transition-colors relative overflow-hidden hover:border-gray-500 col-span-1">
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{caseItem.title}</h3>
                <p className="text-gray-500 text-xs mb-4 font-mono relative z-10">代表工具：{caseItem.tools}</p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed relative z-10">{caseItem.desc}</p>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {caseItem.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 border border-white/5 rounded text-gray-400">{tag}</span>)}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ================= 07. 核心案例一：AI Agent 工作流设计 ================= */}
        <section id="case-1" className="mt-32">
          <SectionTitle 
            title="核心案例一：AI Agent 工作流设计" 
            subtitle="Codex / OpenClaw：从业务策略到制作落地的上下游闭环" 
            centered={true}
          />
          
          <div className="space-y-8">
            {/* A. Codex */}
            <FadeIn className="glass-card rounded-3xl overflow-hidden border-[#8b5cf6]/30">
              <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                <h4 className="text-2xl md:text-3xl font-black text-white mb-4">A. Codex 特效业务全链路自动化</h4>
                <div className="text-sm text-[#a78bfa] mb-8 font-mono tracking-widest">关键词 → 素材 → 热点 → 分析 → 提案 → 落地</div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="glass-card rounded-3xl p-8 bg-[#050505]/70">
                    <div className="mb-8">
                      <div className="text-[#a78bfa] text-xs font-mono tracking-widest mb-4">WHAT IS AI EFFECT</div>
                      <h5 className="text-white font-black text-2xl mb-5">什么是 AI 特效</h5>
                      <p className="text-gray-400 text-sm leading-loose">
                        用户上传人物、商品或素材图片，通过特效模板生成更具传播感的艺术照、海报图或视频结果，在社交平台抖音和 TT 等上面进行玩法传播。
                      </p>
                    </div>
                    <ImagePlaceholder label="占位图 01 / 什么是AI特效-概念说明" className="h-[330px]" icon={<Sparkles size={44}/>} />
                  </div>
                  <div className="glass-card rounded-3xl p-8 bg-[#050505]/70">
                    <div className="mb-8">
                      <div className="text-[#a78bfa] text-xs font-mono tracking-widest mb-4">FROM VISUAL TO PARTICIPATION</div>
                      <h5 className="text-white font-black text-2xl mb-5">从视觉效果到跟拍玩法</h5>
                      <p className="text-gray-400 text-sm leading-loose">
                        AI 特效不仅关注最终画面，还需要考虑用户是否愿意点击、生成、发布和跟拍，以及商家是否能够用于推广。比如世界杯，联合球星卡以及球衣，为球衣带货；AI 特效女生是受众最多的群体，也可以拓展到 AI 试穿等业务。
                      </p>
                    </div>
                    <ImagePlaceholder label="占位图 02 / AI特效工作流-流程说明" className="h-[330px]" icon={<Workflow size={44}/>} />
                  </div>
                </div>

                <div className="mb-12 rounded-3xl border border-[#8b5cf6]/25 bg-gradient-to-br from-[#1d1233]/80 via-[#100c22]/80 to-[#080817]/95 p-8 md:p-10">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h5 className="text-white font-bold text-xl mb-5 flex items-center"><Target className="w-5 h-5 mr-3 text-[#c4b5fd]" />业务痛点</h5>
                      <p className="text-gray-300 text-sm leading-loose">
                        节日与热点变化快，素材案例分散，前期方案需要大量关键词裂变、选题、风格与制作缺少统一链路，制作提示词难以复用。同时只用效果很难说服业务方认可，需要大量尝试创意。
                      </p>
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-xl mb-5 flex items-center"><Zap className="w-5 h-5 mr-3 text-[#c4b5fd]" />解决方案</h5>
                      <p className="text-gray-300 text-sm leading-loose">
                        通过 Skill 串联完整业务链路，同时帮助业务方制作可自动搜集网络热点和工作流，用于应对节目节点，通过数据说明目前的特效热度，结合业务方输出的参考方向，汇总说明组合结论，最后输出推荐方案并给出评分。
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 my-8"></div>
                  <div className="flex flex-wrap gap-3">
                    {['全链路自动化', '个性化表现整理', 'AI 图像素材采集', '数据化方案推荐', 'AI 自动选题', 'Html完整展示', '需求方协同评估', '参考转化制作'].map((tag, i) => (
                      <span key={i} className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-sm text-gray-200 font-medium">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-12">
                  <h5 className="text-3xl md:text-4xl font-black text-white tracking-wide mb-4">Demo Case：美加墨世界杯 AI 特效方案</h5>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-4xl">
                    用一个真实跑通的项目，验证 Skill 是否能够参与 AI 特效业务的前期判断与方向推荐。
                  </p>
                  <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-5 glass-card rounded-2xl p-8 bg-[#050505]/70 h-full">
                      <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center mb-7">
                        <Target className="text-[#c4b5fd] w-8 h-8" />
                      </div>
                      <div className="space-y-7">
                        <div>
                          <div className="text-gray-500 text-xs mb-2">项目类型</div>
                          <div className="text-white text-lg font-bold">热点体育主题 AI 特效</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-2">项目目标</div>
                          <div className="text-gray-300 text-base leading-relaxed">围绕世界杯相关主题，寻找适合生成、点击、跟拍和传播的特效方向。</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-2">业务方向</div>
                          <div className="text-gray-300 text-base leading-relaxed">以热点主题为核心，结合视觉趋势、用户参与和内容传播。</div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-7 glass-card rounded-2xl p-0 bg-[#050505]/70 h-full overflow-hidden">
                      <ImagePlaceholder label="可替换为模糊业务截图 / Demo Screenshot Placeholder" className="h-full min-h-[430px] rounded-2xl border-0" icon={<LayoutTemplate size={48}/>} />
                    </div>
                  </div>
                </div>

                {/* Flow Block */}
                <div className="mb-14">
                   <h5 className="text-white font-bold mb-4 flex items-center"><Workflow className="w-5 h-5 mr-2 text-[#8b5cf6]" /> 全链路流程图页面</h5>
                   <div className="bg-[#050505] p-8 rounded-xl border border-white/5 overflow-x-auto">
                     <div className="flex items-center min-w-max pb-2 flex-wrap gap-y-4">
                       <FlowNode text="项目目的/目标" highlight={true} />
                       <FlowNode text="关键词裂变" />
                       <FlowNode text="热点搜集" />
                       <FlowNode text="平台素材采集" />
                       <FlowNode text="案例分析" />
                       <FlowNode text="风格判断" />
                       <FlowNode text="内部资产匹配" />
                       <FlowNode text="方案提案" />
                       <FlowNode text="落地方式" />
                       <FlowNode text="文档/网页交付" isLast={true} highlight={true} />
                     </div>
                   </div>
                </div>

                {/* Image Grids */}
                <div className="space-y-14">
                   <div>
                     <h5 className="text-white font-bold mb-4">项目背景与目标 / 热点自动搜集工作流</h5>
                     <div className="grid md:grid-cols-2 gap-8">
                       <ImagePlaceholder label="Codex 全链路流程图大图 / assets/codex-workflow-main.png" className="h-[385px]" icon={<Workflow size={40}/>} />
                       <ImagePlaceholder label="热点自动搜集工作流 / assets/codex-hotspot-workflow.png" className="h-[385px]" icon={<Search size={40}/>} />
                     </div>
                   </div>

                   <div>
                     <h5 className="text-white font-bold mb-4">真实 Skill 证据结构墙</h5>
                     <div className="relative rounded-3xl bg-[#02040a]/75 border border-white/5 p-5 md:p-6 overflow-hidden">
                       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_40%,rgba(59,130,246,0.06),transparent_30%),radial-gradient(circle_at_88%_55%,rgba(139,92,246,0.07),transparent_28%)]"></div>
                       <div className="relative z-10 grid lg:grid-cols-12 gap-5 items-stretch">
                         <div className="lg:col-span-3">
                           <SkillEvidenceCard
                             large
                             number="00 /"
                             title="Skill 总设计"
                             desc="定义整体目标、流程框架与交付物，明确核心模块与输出节奏。"
                             src="/assets/skill-evidence/00_SKILL-adjusted.png"
                           />
                         </div>
                         <div className="lg:col-span-6 grid md:grid-cols-2 gap-5 content-between">
                           <SkillEvidenceCard
                             number="01 /"
                             title="业务输入规则"
                             desc="明确业务输入方向、处理原则与参考方向。"
                             src="/assets/skill-evidence/01-business-input.png"
                             showTags={false}
                           />
                           <SkillEvidenceCard
                             number="02 /"
                             title="采集计划"
                             desc="制定采集策略、优先级与分级标准。"
                             src="/assets/skill-evidence/02-collection-plan.png"
                             showTags={false}
                           />
                           <SkillEvidenceCard
                             number="03 /"
                             title="关键词裂变方法"
                             desc="定义裂变逻辑与扩展方式。"
                             src="/assets/skill-evidence/03-keyword-split.png"
                             showTags={false}
                           />
                           <SkillEvidenceCard
                             number="04 /"
                             title="跨平台趋势总结"
                             desc="整合多平台趋势并输出组合判断。"
                             src="/assets/skill-evidence/04-cross-platform-trend.png"
                             showTags={false}
                           />
                         </div>
                         <div className="lg:col-span-3">
                           <SkillEvidenceCard
                             large
                             number="05 /"
                             title="HTML 结构设计"
                             desc="定义报告页面结构与组件，确保内容清晰可读、稳定输出。"
                             src="/assets/skill-evidence/05-html-adjusted.png"
                           />
                         </div>
                       </div>
                       <div className="hidden lg:block absolute left-[25.2%] top-1/2 -translate-y-1/2 text-[#8b5cf6] text-5xl font-black drop-shadow-[0_0_14px_rgba(139,92,246,0.65)]">›</div>
                       <div className="hidden lg:block absolute right-[25.2%] top-1/2 -translate-y-1/2 text-[#8b5cf6] text-5xl font-black drop-shadow-[0_0_14px_rgba(139,92,246,0.65)]">›</div>
                     </div>
                   </div>

                   <div>
                     <h5 className="text-white font-bold mb-4">提案与最终结果网页截图展示页面</h5>
                     {/* 变成两排的大展示区 */}
                      <div className="grid grid-cols-2 gap-10">
                       <ImagePlaceholder label="提案页 1 / assets/codex-proposal-01.png" className="h-[365px]" />
                       <ImagePlaceholder label="提案页 2 / assets/codex-proposal-02.png" className="h-[365px]" />
                       <ImagePlaceholder label="最终网页 1 / assets/codex-result-web-01.png" className="h-[365px]" />
                       <ImagePlaceholder label="最终网页 2 / assets/codex-result-web-02.png" className="h-[365px]" />
                      </div>
                   </div>
                </div>
              </div>
            </FadeIn>

            {/* B. OpenClaw */}
            <FadeIn className="glass-card rounded-3xl overflow-hidden border-[#8b5cf6]/30">
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                <h4 className="text-2xl md:text-3xl font-black text-white mb-4">B. OpenClaw 提示词反推工具</h4>
                <div className="text-sm text-[#a78bfa] mb-8 font-mono tracking-widest">特效 Prompt 标准化与网页化交付</div>
                
                <div className="grid lg:grid-cols-12 gap-14 mb-14">
                  <div className="lg:col-span-7 space-y-5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="font-bold text-white">项目背景：</span>特效生成需大量高质量 Prompt，人工编写易导致结果不稳定、效率低。
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="font-bold text-[#a78bfa]">解决方案与强调：</span>使用 OpenClaw 将图像识别、视觉维度拆解、权重判断封装为网页工具。这个逻辑来自我的<span className="text-white">个人实践沉淀</span>，因为我本人提示词写作能力强，将其提炼为固定结构。这不是简单生成器，而是经验的标准化、网页化。
                    </p>
                    
                    <div className="bg-[#050505] p-5 rounded-xl border border-white/5 overflow-x-auto">
                       <div className="text-xs text-gray-500 mb-3 font-mono">OpenClaw 提示词反推流程</div>
                       <div className="flex items-center min-w-max pb-2">
                         <FlowNode text="上传参考图" />
                         <FlowNode text="识别内容" />
                         <FlowNode text="反推维度与权重" />
                         <FlowNode text="拆解(服装/场景/构图等)" />
                         <FlowNode text="输出结构化Prompt" isLast={true} highlight={true}/>
                       </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-2xl p-8 text-center relative overflow-hidden h-full flex flex-col items-center justify-center">
                      <div className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-widest">提效数据总结</div>
                      <div className="text-6xl font-black text-[#a78bfa] mb-2">40<span className="text-3xl">%</span></div>
                      <div className="text-white font-medium mb-4">制作阶段节省时间</div>
                      <div className="text-xs text-gray-400 leading-relaxed max-w-[250px]">Codex + OpenClaw 组合后，在制作阶段大幅提效。统一团队格式，降低门槛。</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-14">
                   <div>
                     <h5 className="text-white font-bold mb-4">工具介绍页 & 网页工具截图</h5>
                     <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                       <ImagePlaceholder label="工具主界面横屏 / assets/openclaw-tool-01.png" className="lg:col-span-6 h-[520px]" icon={<LayoutTemplate size={42}/>} />
                       <ImagePlaceholder label="写真提示词生成器界面 / assets/openclaw-tool-vertical-01.png" className="lg:col-span-3 h-[520px]" icon={<LayoutTemplate size={36}/>} />
                       <ImagePlaceholder label="工具录屏演示 / assets/openclaw-tool-recording.mp4" className="lg:col-span-3 h-[520px]" icon={<Video size={40}/>} type="video" />
                     </div>
                   </div>
                   <div>
                     <h5 className="text-white font-bold mb-4">具体工作流程图</h5>
                     <div
                       className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-[#050505] p-3 transition-all duration-300 hover:border-[#8b5cf6]/40 hover:bg-[#10091f] hover:shadow-[0_0_28px_rgba(139,92,246,0.14)]"
                       role="button"
                       tabIndex={0}
                       onClick={() => openMediaPreview({ label: 'OpenClaw 具体工作流程图 / assets/openclaw-workflow-final.jpg', src: assetUrl('assets/openclaw-workflow-final.jpg') })}
                       onKeyDown={(event) => {
                         if (event.key === 'Enter' || event.key === ' ') openMediaPreview({ label: 'OpenClaw 具体工作流程图 / assets/openclaw-workflow-final.jpg', src: assetUrl('assets/openclaw-workflow-final.jpg') });
                       }}
                     >
                       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent_35%)] opacity-70"></div>
                       <img
                         src={assetUrl('assets/openclaw-workflow-final.jpg')}
                         alt="OpenClaw 具体工作流程图"
                         className="relative z-10 block w-full rounded-xl object-contain"
                       />
                       <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     </div>
                   </div>
                </div>
              </div>
            </FadeIn>

            {/* C. 总结 */}
            <FadeIn className="bg-gradient-to-r from-[#8b5cf6]/20 to-transparent p-8 md:p-10 rounded-3xl border border-[#8b5cf6]/40 mt-8 text-center md:text-left">
               <h4 className="text-3xl font-black text-white mb-6">从策略到制作的 AI Agent 工作流闭环</h4>
               <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                 {['复杂业务拆解', '项目目标理解', '关键词裂变', '热点自动搜集', '方案提案', 'Prompt标准化', '网页工具交付', '制作阶段提效40%'].map(tag => (
                   <span key={tag} className="px-3 py-1.5 bg-[#050505] border border-[#8b5cf6]/30 rounded-lg text-sm text-[#a78bfa]">{tag}</span>
                 ))}
               </div>
            </FadeIn>
          </div>
        </section>

        {/* ================= 08. 核心案例二：轻量级智能体业务赋能 ================= */}
        <section id="case-2" className="mt-32">
          <SectionTitle 
            title="核心案例二：固定风格配图生成以及商品摆盘" 
            subtitle="Coze：将 Prompt 能力开放给运营和业务侧" 
            desc="Coze 代表的是轻量级智能体业务赋能。它让非设计人员也能快速调用 AI 能力完成日常会场配图、图标生成、素材摆盘等轻量内容生产。" 
            centered={true}
          />

          <div className="space-y-14">
            {/* A. 配图固定风格智能体 */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">A. 固定风格配图生成｜面向会场内容的智能体应用</h3>
              <div className="grid md:grid-cols-2 gap-10 mb-8">
                <div>
                  <div className="text-xs text-gray-500 mb-1">项目背景</div>
                  <p className="text-gray-400 text-sm mb-4">运营需要大量风格统一配图，传统方式需设计师反复写提示词调试。</p>
                  <div className="text-xs text-gray-500 mb-1">项目内容</div>
                  <p className="text-gray-400 text-sm mb-4">将水果生鲜、3C小家电、服饰等品类视觉拆解为 Prompt 模板，运营输入商品词即可快速生成配图。</p>
                </div>
                <div className="bg-[#050505] p-5 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-500 mb-3 font-mono">配图生成流程</div>
                  <div className="flex items-center flex-wrap gap-y-2">
                    <FlowNode text="输入商品词" /><FlowNode text="品类识别" /><FlowNode text="匹配风格模板" /><FlowNode text="AI生成配图" /><FlowNode text="合成banner" isLast={true}/>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-8">
                   <div>
                     <h4 className="text-white font-bold mb-3">coze智能体工作原理</h4>
                     <ImagePlaceholder label="Coze智能体工作原理 / assets/coze-image-style-01.png" className="aspect-video" />
                   </div>
                   <div>
                     <h4 className="text-white font-bold mb-3">固定风格配图详细拆解</h4>
                     <ImagePlaceholder label="固定风格配图详细拆解 / assets/coze-image-style-02.png" className="aspect-video" />
                   </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                   <div>
                     <h4 className="text-white font-bold mb-3">风格配图原理和结果</h4>
                     <ImagePlaceholder label="输入输出示例 / assets/coze-image-style-03.png" className="aspect-video" />
                   </div>
                   <div>
                     <h4 className="text-white font-bold mb-3">智能摆盘展示</h4>
                     <ImagePlaceholder label="结果图展示 / assets/coze-image-style-result.png" className="aspect-video" />
                   </div>
                 </div>
              </div>
            </FadeIn>

            {/* D. Coze 总结 */}
            <FadeIn className="bg-gradient-to-r from-transparent via-white/5 to-transparent p-8 rounded-3xl border-y border-white/10 text-center">
               <h4 className="text-xl font-bold text-[#a78bfa] mb-4">轻量级智能体如何赋能业务侧内容生产</h4>
               <p className="text-gray-400 text-sm max-w-3xl mx-auto mb-6">
                 Coze 智能体的价值在于将 Prompt 能力、品类风格判断和基础视觉生成能力封装给运营和业务侧使用。它解决高频、轻量、标准化的内容生产需求，让非设计人员也能在统一规范下快速获得可用结果。
               </p>
               <div className="flex flex-wrap gap-2 justify-center">
                 {['品类 Prompt 模板', '千人千面商品图', '图标生成规范', '摆盘逻辑', '非设计人员可用'].map(tag => <span key={tag} className="text-xs px-3 py-1 bg-[#050505] rounded text-gray-500">{tag}</span>)}
               </div>
            </FadeIn>
          </div>
        </section>

        {/* ================= 09. 核心案例三：AI内容生成完整项目 ================= */}
        <section id="case-3" className="mt-32">
          <SectionTitle 
            title="核心案例三：AI内容生成完整项目" 
            subtitle="Case 03 . AI Production" 
            desc="从创意、脚本、分镜到视频成片与视觉内容输出。这体现了我从创意到产出、从图片到视频、从单张视觉到完整内容项目的商业化 AI 内容生产能力。" 
            centered={true}
          />

          <div className="space-y-28">
            {/* A. 视频全流程 */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-3xl border-t-4 border-[#8b5cf6]">
              <h3 className="text-2xl font-bold text-white mb-4">A. AI视频完整制作流程｜从 Brief 到成片交付</h3>
              <p className="text-gray-400 text-sm mb-8">在这里我从事了完整的 AI 视频制作工作。可展示从需求、创意、脚本、分镜、关键帧、AI视频生成到后期剪辑和成片交付的全流程。</p>
              
              <div className="bg-[#050505] p-8 rounded-xl border border-white/5 overflow-x-auto mb-12">
                 <div className="text-xs text-gray-500 mb-4 font-mono">视频制作全流程</div>
                 <div className="flex items-center min-w-max pb-2">
                   <FlowNode text="需求 Brief" />
                   <FlowNode text="创意/脚本" />
                   <FlowNode text="分镜设计" />
                   <FlowNode text="生成关键帧" />
                   <FlowNode text="AI视频生成" />
                   <FlowNode text="后期剪辑包装" />
                   <FlowNode text="成片交付" isLast={true} highlight={true}/>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                 <ImagePlaceholder label="流程图 / assets/ai-video-process.png" className="aspect-video" />
                 <ImagePlaceholder label="分镜页 / assets/ai-video-storyboard.png" className="aspect-video" />
                 <ImagePlaceholder label="关键帧页 / assets/ai-video-keyframes.png" className="aspect-video" />
                 <ImagePlaceholder label="制作过程与结果 / assets/ai-video-editing.png" className="aspect-video" icon={<Video size={40}/>}/>
              </div>
              <div className="mt-14 border-t border-white/10 pt-8">
                 <div className="mb-6 flex items-center justify-between gap-6">
                   <div>
                     <div className="text-xs text-[#a78bfa] font-mono tracking-widest uppercase">Video Output</div>
                     <h4 className="text-white text-lg font-bold mt-2">横版成片与录屏展示</h4>
                   </div>
                   <div className="hidden md:block text-xs text-gray-500 font-mono">4 Screens / 16:9</div>
                 </div>
                 <div className="grid grid-cols-4 gap-6">
                   <ImagePlaceholder label="AI视频横版分镜图 1 / assets/ai-video-horizontal-storyboard-1.png" className="aspect-video" />
                   <ImagePlaceholder label="AI视频横版展示 2 / assets/ai-video-horizontal-2.mp4" className="aspect-video" icon={<Video size={36}/>} />
                   <ImagePlaceholder label="AI视频横版分镜图 3 / assets/ai-video-horizontal-storyboard-3.png" className="aspect-video" />
                   <ImagePlaceholder label="AI视频横版展示 4 / assets/ai-video-horizontal-4.mp4" className="aspect-video" icon={<Video size={36}/>} />
                 </div>
              </div>
            </FadeIn>

            {/* C. 长视频 */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">C. AI长视频项目</h3>
              <p className="text-gray-400 text-sm mb-8">更完整的叙事、镜头和风格控制。这里先用一整屏横向区域承载成片或主视频，再向下展示关键帧与结果拆解。</p>
              <ImagePlaceholder label="长视频封面 / assets/ai-video-long-cover.png" className="aspect-video w-full" icon={<Video size={44}/>} />
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 mt-5">
                <ImagePlaceholder label="关键帧 01 / assets/ai-video-long-frame-01.png" className="aspect-[16/7.6]" />
                <ImagePlaceholder label="关键帧 02 / assets/ai-video-long-frame-02.png" className="aspect-[16/7.6]" />
                <ImagePlaceholder label="成片/结果 1 / assets/ai-video-long-frame-03.png" className="aspect-[16/7.6]" />
                <ImagePlaceholder label="成片/结果 2" className="aspect-[16/7.6]" />
              </div>
            </FadeIn>

            {/* D. KV / 海报 */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-6">D. AI商业视觉生成｜KV、海报与电商视觉</h3>
              <ImagePlaceholder label="AI商业视觉整屏展示 / assets/ai-commercial-visual-wide.png" className="aspect-video w-full mb-6" icon={<Palette size={48}/>} />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ImagePlaceholder label="KV图 1 / assets/ai-kv-grid-01.png" className="col-span-2 md:col-span-3 h-[300px]" icon={<Palette size={40}/>} />
                <ImagePlaceholder label="KV图 2 / assets/ai-kv-grid-02.png" className="col-span-1 md:col-span-2 h-[300px]" />
                <ImagePlaceholder label="KV图 3 / assets/ai-kv-grid-03.png" className="col-span-1 md:col-span-2 h-[250px]" />
                <ImagePlaceholder label="海报 / assets/ai-poster-01.png" className="col-span-1 md:col-span-1 h-[250px]" />
                <ImagePlaceholder label="电商视觉 / assets/ai-commerce-visual-01.png" className="col-span-2 md:col-span-2 h-[250px]" />
              </div>
            </FadeIn>

            {/* E 奇妙夜 (独占一屏) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">E. 博物馆奇妙夜业务</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-4xl">已有业务内容：从业务目标到内容输出的完整过程，沉浸式氛围探索与生成。</p>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <ImagePlaceholder label="视觉方向设计 / assets/museum-night-01.png" className="aspect-video w-full" />
                  <ImagePlaceholder label="视觉方向设计 2 / assets/museum-night-04.png" className="aspect-video w-full" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <ImagePlaceholder label="场景图 2 / assets/museum-night-02.png" className="h-[250px]" />
                  <ImagePlaceholder label="场景图 3 / assets/museum-night-03.png" className="h-[250px]" />
                </div>
              </div>
            </FadeIn>

            {/* G. 总结 */}
            <FadeIn className="bg-gradient-to-r from-transparent via-[#8b5cf6]/10 to-transparent p-8 rounded-3xl border-y border-[#8b5cf6]/20 text-center">
               <h4 className="text-xl font-bold text-[#a78bfa] mb-4">从单点生成到完整内容项目</h4>
               <p className="text-gray-400 text-sm max-w-4xl mx-auto mb-6">
                 它体现了我从创意到产出、从图片到视频、从视觉探索到商业交付的完整能力。不仅包括单张图像，也包括脚本、分镜、关键帧、视频生成、后期包装、KV、海报、写真和业务视觉等多种输出形态。
               </p>
            </FadeIn>
          </div>
        </section>

        {/* ================= 10. 核心案例四：传统视觉动效与三维资产 ================= */}
        <section id="case-traditional" className="mt-32">
          <SectionTitle 
            title="核心案例四：传统视觉动效与三维资产" 
            subtitle="Case 04 . Foundation" 
            desc="支撑 AI 内容生产的底层设计能力。这代表了我个人长期的专业积累，更是我进行 AI 生成、镜头判断、构图质感把控的坚实基石。" 
            centered={true}
          />

          <div className="flex flex-col space-y-36">
            {/* A. 3D Showreel (独占一整屏) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-[40px]">
              <h3 className="text-3xl font-bold text-white mb-8">A. 电商 3D 视频 Showreel</h3>
              <div className="space-y-6">
                <ImagePlaceholder label="Showreel 主视觉/封面大图 / assets/showreel-3d-01.png" className="aspect-video w-full" icon={<Video size={48}/>} />
                <div className="grid grid-cols-4 gap-8">
                  {[2, 3, 4, 5].map(i => <ImagePlaceholder key={i} label={`帧 ${i}`} className="aspect-video" />)}
                </div>
              </div>
            </FadeIn>

            {/* B. 字节动效 (独立大块) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-[40px] border-l-4 border-l-[#a78bfa]">
              <h3 className="text-3xl font-bold text-white mb-4">B. 电商动效与TVC业务</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-12 max-w-4xl">
                在字节跳动电商阶段，我不仅参与 AIGC 建设，也持续承担传统动效与 TVC 业务的设计产出。覆盖大促营销、会场、弹窗与KV动画，证明 AI 工作流之外仍具备扎实的商业动效交付能力。
              </p>
              
              <div className="grid md:grid-cols-2 gap-10 mb-8">
                <ImagePlaceholder label="团队Showreel封面 / assets/bytedance-motion-showreel.png" className="aspect-video" icon={<MonitorPlay size={40}/>} />
                <ImagePlaceholder label="TVC封面 / assets/bytedance-tvc-cover-01.png" className="aspect-video" icon={<Video size={40}/>} />
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                {['弹窗长图 1', '弹窗长图 2', '会场长图 1', '会场长图 2', 'KV长图 1', '3D动画长图 1'].map((label, i) => (
                  <ImagePlaceholder key={i} label={label} className="aspect-[9/16]" />
                ))}
              </div>
            </FadeIn>

            {/* C. 3D IP BDC (独立拆开) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-[40px]">
              <h3 className="text-3xl font-bold text-white mb-8">C. 3D IP BDC 资产与延展</h3>
              <ImagePlaceholder label="3D IP BDC 横版展示 / assets/ip-bdc-wide-01.png" className="aspect-video w-full mb-8" />
              <div className="grid md:grid-cols-2 gap-10 mb-6">
                 <ImagePlaceholder label="IP形象大图 1 / assets/ip-bdc-01.png" className="h-[400px]" />
                 <ImagePlaceholder label="IP形象大图 2 / assets/ip-bdc-02.png" className="h-[400px]" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[3, 4, 5, 6].map(i => <ImagePlaceholder key={i} label={`衍生周边/延展 ${i}`} className="h-[200px]" />)}
              </div>
            </FadeIn>

            {/* D. 3D 大型项目支持 (独立拆开) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-[40px]">
              <h3 className="text-3xl font-bold text-white mb-8">D. 3D 大型项目与空间视觉</h3>
              <ImagePlaceholder label="大型项目主视觉 / 跨年晚会 / 赛博国风场景 / assets/large-project-01.png" className="aspect-video mb-6 w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[2, 3, 4, 5].map(i => <ImagePlaceholder key={i} label={`场景细部 ${i}`} className="h-[200px]" />)}
              </div>
              <ImagePlaceholder label="大型项目主视觉 2 / 横版大图" className="aspect-video mt-6 w-full" />
              <ImagePlaceholder label="大型项目主视觉 3 / 横版整屏展示" className="aspect-video mt-6 w-full" />
              <ImagePlaceholder label="大型项目主视觉 4 / 横版整屏展示" className="aspect-video mt-6 w-full" />
            </FadeIn>

            {/* F. 3D打印与实体衍生品 (新增) */}
            <FadeIn className="glass-card p-10 md:p-14 rounded-[40px]">
              <h3 className="text-3xl font-bold text-white mb-8">F. 3D 打印与实体衍生品</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-4xl">实体奖杯设计、地标雕塑与手办全流程跟进，打通从 3D 视觉到实体落地的生产全链路。</p>
              <div className="space-y-6 mb-6">
                <ImagePlaceholder label="实体衍生品横版展示 01 / assets/physical-wide-01.png" className="aspect-video w-full" />
                <ImagePlaceholder label="实体衍生品横版展示 02 / assets/physical-wide-02.png" className="aspect-video w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <ImagePlaceholder label="实体衍生品组合展示 01 / assets/physical-combo-01.png" className="aspect-video" />
                <ImagePlaceholder label="实体衍生品组合展示 02 / assets/physical-combo-02.png" className="aspect-video" />
              </div>
            </FadeIn>

            {/* 总结 */}
            <FadeIn className="bg-[#111] border border-[#222] p-10 rounded-3xl text-center">
               <h4 className="text-xl font-bold text-white mb-4">传统设计技能如何支撑 AI 内容生产</h4>
               <p className="text-gray-400 text-sm max-w-4xl mx-auto mb-6 leading-relaxed">
                 三维视觉、2D/3D动效、TVC、IP与活动包装经验，帮助我在 AI 工作中更准确判断构图、镜头、质感、节奏、角色、场景和商业落地质量。
               </p>
               <div className="flex flex-wrap gap-2 justify-center">
                 {['镜头判断', '质感控制', '构图节奏', '商业视觉', 'IP资产'].map(tag => <span key={tag} className="text-xs px-3 py-1 bg-[#050505] rounded text-gray-500">{tag}</span>)}
               </div>
            </FadeIn>
          </div>
        </section>

        <div className="h-px w-full bg-white/10 my-24"></div>

        {/* ================= 11. AI方法论与团队赋能 ================= */}
        <section id="methodology" className="mt-32">
          <SectionTitle 
            title="AI方法论与团队赋能" 
            subtitle="Methodology & Enablement" 
            desc="2025年至2026年初，持续进行内部 AI 工具研究、培训与方法论沉淀，帮助团队理解主流 AI 工具的能力边界、适用场景和实际工作流。"
            centered={true}
          />
          
          <div className="space-y-8">
            {/* A */}
            <FadeIn className="glass-card p-8 md:p-10 rounded-3xl">
              <div className="grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-4">
                  <h3 className="text-3xl font-black text-white mb-6">A. AI 应用层面｜生图、视频与内容生成</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['生图', '生成视频', 'AI写真', 'AI海报', 'AI美术字', 'AI电商视觉', '长短视频'].map(t => <span key={t} className="px-3 py-1 bg-[#050505] text-xs text-gray-400 rounded border border-white/5">{t}</span>)}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 text-sm text-gray-400">
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>GPT-image2.0 助力电商视频</div>
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>GPT-4o 电商设计玩法探索</div>
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>Seedance 电商视频玩法探索</div>
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>Sora 2 电商视频玩法探索</div>
                  </div>
                </div>
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
                  <ImagePlaceholder label="培训截图 / assets/training-ai-application-01.png" className="aspect-video" />
                  <ImagePlaceholder label="培训截图 / assets/training-ai-application-02.png" className="aspect-video" />
                </div>
              </div>
            </FadeIn>

            {/* B */}
            <FadeIn delay={0.1} className="glass-card p-8 md:p-10 rounded-3xl">
              <div className="grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-4">
                  <h3 className="text-3xl font-black text-white mb-6">B. 软件应用层面｜能力边界与适用场景</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Lovart', 'ComfyUI', 'Midjourney', 'Sora', 'Seedance', 'Banana Pro', 'GPT-4o'].map(t => <span key={t} className="px-3 py-1 bg-[#050505] text-xs text-gray-400 rounded border border-white/5">{t}</span>)}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 text-sm text-gray-400">
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>Lovart 电商设计提效 / 超级设计助手</div>
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>Banana Pro 3D渲染 / 电商设计探索</div>
                    <div className="flex items-center"><Target className="w-4 h-4 mr-3 text-[#8b5cf6]"/>ComfyUI 工作流 / Midjourney 风格</div>
                  </div>
                </div>
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
                  <ImagePlaceholder label="软件矩阵 / assets/training-software-01.png" className="aspect-video" />
                  <ImagePlaceholder label="培训截图 / assets/training-software-02.png" className="aspect-video" />
                </div>
              </div>
            </FadeIn>

            {/* C */}
            <FadeIn delay={0.2} className="glass-card p-8 md:p-10 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6">C. 智能体组合应用｜Coze / OpenClaw / Codex 工作流</h3>
              <div className="grid md:grid-cols-3 gap-10">
                <div className="col-span-1">
                   <p className="text-sm text-gray-400 leading-relaxed mb-6">探讨智能体与提示词的组合工作流方式，形成方法论总结。推动业务提效和网页工具化。</p>
                   <ul className="text-sm text-[#a78bfa] space-y-4 font-mono bg-[#8b5cf6]/10 p-5 rounded-xl border border-[#8b5cf6]/20">
                     <li>- OpenClaw 工作流实践</li>
                     <li>- Codex 特效业务工作流</li>
                     <li>- Coze 会场生成智能体</li>
                     <li>- 提示词反推与业务自动化</li>
                   </ul>
                </div>
                <div className="col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-8">
                   <ImagePlaceholder label="组合流 / assets/training-agent-01.png" className="h-[250px]" />
                   <ImagePlaceholder label="分享主题 / assets/training-agent-02.png" className="h-[250px]" />
                   <ImagePlaceholder label="关系图 / assets/training-agent-workflow.png" className="h-[250px] col-span-2 lg:col-span-1" />
                </div>
              </div>
            </FadeIn>

            {/* D */}
            <FadeIn delay={0.3} className="bg-gradient-to-r from-transparent via-[#8b5cf6]/10 to-transparent p-8 md:p-10 rounded-3xl border-y border-[#8b5cf6]/20 text-center">
               <h4 className="text-2xl font-black text-white mb-6">从个人经验到团队方法论</h4>
               <p className="text-gray-300 text-base max-w-4xl mx-auto mb-6 leading-relaxed">
                 我的团队赋能不只是工具分享，而是通过实际项目、工具评测、案例复盘和方法论总结，让团队能够更快选择工具、更快验证方案、更稳定地产出内容。推动 AI 能力从个人能力转变为团队能力。
               </p>
            </FadeIn>
          </div>
        </section>

        {/* ================= 12. 总结 / 联系方式 ================= */}
        <footer className="pt-32 pb-16">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-white mb-8">我能为团队带来的价值</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              不仅仅是单纯的 AI 工具操作，而是将 AI 工具、传统设计经验、动效交付能力与业务流程深度结合，搭建<span className="text-white font-bold mx-2">可复用、可培训、可交付</span>的内容生产底座。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
            {[
              { t: '1. 用Agent设计业务工作流', d: '使用 Codex、OpenClaw 等工具完成从调研到方案交付的自动化流程。' },
              { t: '2. AI内容生产', d: '快速完成写真、视频、KV、会场图等商业内容。' },
              { t: '3. Prompt工程标准化', d: '将个人经验转化为可复用的提示词结构和生成规范。' },
              { t: '4. 智能体工具化', d: '让运营、设计和业务都能通过工具提升效率。' },
              { t: '5. 传统动效与TVC交付', d: '支撑电商大促、会场、弹窗、KV动画、3D电商动画和TVC等商业动效产出。' },
              { t: '6. 团队方法论赋能', d: '持续进行 AI 工具分享、流程沉淀和内部培训。' }
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card p-10 rounded-3xl h-full border-t-2 border-t-transparent hover:border-t-[#a78bfa] transition-all bg-[#0a0a0a]">
                  <div className="text-white font-bold text-xl mb-4">{val.t}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{val.d}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white mb-2 tracking-widest">盛坤<span className="mx-4 text-[#a78bfa]">|</span>SHENGKUN</div>
              <div className="text-gray-600 text-sm font-mono uppercase tracking-widest">Portfolio 2026</div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <a href="mailto:rocksheng001@gmail.com" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mr-4 group-hover:bg-[#a78bfa]/20 transition-colors">
                  <Mail size={18} className="text-[#a78bfa]" />
                </div>
                <span className="font-mono text-base">rocksheng001@gmail.com</span>
              </a>
              <a href="tel:+8618255383506" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mr-4 group-hover:bg-[#a78bfa]/20 transition-colors">
                  <Phone size={18} className="text-[#a78bfa]" />
                </div>
                <span className="font-mono text-base">+86 182 5538 3506</span>
              </a>
            </div>
          </div>
        </footer>

      </main>
    </div>
    </PortfolioContentContext.Provider>
  );
}

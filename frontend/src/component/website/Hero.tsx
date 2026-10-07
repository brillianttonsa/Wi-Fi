import { useState } from "react";
import { Button, Icon } from "../shared";
import type { WebsiteActions } from "./types";

export function Hero({ onLogin, onRegister }: WebsiteActions) {
    const [speeds] = useState({
    download: "85.4",
    upload: "38.2",
  });
  return (
    <section className="relative mx-auto grid max-w-[1220px] items-center gap-10 px-5 pb-16 pt-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24">
      <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-72 w-72 rounded-full bg-[#fa6b37]/10 blur-3xl" />
      <div className="max-w-[560px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e8ecdf] bg-white/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#123d33] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#fa6b37]" /> Internet that keeps up
        </span>
        <h1 className="mt-6 text-[3.1rem] font-extrabold leading-[0.95] tracking-[-0.08em] sm:text-[4.3rem] lg:text-[5.1rem]">
          Fast. Affordable.<br /><em className="not-italic text-[#fa6b37]">Reliable Wi-Fi.</em>
        </h1>
        <p className="mt-5 max-w-[480px] text-base leading-7 text-[#4d5d58]">
          Stay connected to what matters with flexible plans, effortless payments, and speeds you can count on.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onRegister} className="min-h-[46px] px-5 text-[12px]">
            Get connected <Icon name="arrow" size={17} />
          </Button>
          <Button variant="secondary" onClick={onLogin} className="min-h-[46px] px-5 text-[12px]">
            I have an account
          </Button>
        </div>
        
      </div>

      <div className="relative mx-auto h-[430px] w-full max-w-[520px] lg:h-[520px]">
      <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full border border-[#dfe5de] bg-white/30" />
      <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full border border-[#dfe5de] bg-white/50" />
      <div className="absolute left-1/2 top-36 h-40 w-40 -translate-x-1/2 rounded-full border border-[#dfe5de] bg-white/70" />
      
      <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-[#dfe5de] bg-[#f8faf6] p-5 shadow-[0_28px_60px_rgba(16,47,40,0.14)]">
        <div className="flex items-center justify-between border-b border-[#edf1ed] pb-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#123d33]">
            <Icon name="wifi" size={14} /> linka
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ebf8f0] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#1f7d59]">
            <i className="h-2 w-2 rounded-full bg-[#39b36b]" /> Online
          </span>
        </div>
        
        <div className="flex flex-col items-center py-8">
          <span className="mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1ea] text-[#fa6b37]"><Icon name="wifi" size={36} /></span>
          <strong className="text-[26px] font-extrabold tracking-[-0.06em]">Connected</strong>
          <small className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#6f7f79]">Excellent signal</small>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#edf1ed] pt-4">
          <span className="rounded-xl bg-[#f4f6f2] p-3">
            <small className="block text-[8px] uppercase tracking-[0.14em] text-[#7b8a84]">Download</small>
            <strong className="mt-2 block text-xl font-extrabold tracking-[-0.06em]">
              {speeds.download} <i className="text-[10px] font-medium not-italic text-[#7b8a84]">Mbps</i>
            </strong>
          </span>
          <span className="rounded-xl bg-[#f4f6f2] p-3">
            <small className="block text-[8px] uppercase tracking-[0.14em] text-[#7b8a84]">Upload</small>
            <strong className="mt-2 block text-xl font-extrabold tracking-[-0.06em]">
              {speeds.upload} <i className="text-[10px] font-medium not-italic text-[#7b8a84]">Mbps</i>
            </strong>
          </span>
        </div>
      </div>

      <div className="absolute -left-2 top-28 flex items-center gap-3 rounded-2xl border border-[#edf1ed] bg-white px-3 py-2 shadow-[0_18px_28px_rgba(13,39,33,0.08)]">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fff1ea] text-[#fa6b37]"><Icon name="zap" size={16} /></span>
        <span><small className="block text-[8px] uppercase tracking-[0.14em] text-[#7b8a84]">Lightning fast</small><strong className="text-[11px]">Up to high Mbps</strong></span>
      </div>

      <div className="absolute -right-2 bottom-14 flex items-center gap-3 rounded-2xl border border-[#edf1ed] bg-white px-3 py-2 shadow-[0_18px_28px_rgba(13,39,33,0.08)]">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eff8f4] text-[#123d33]"><Icon name="shield" size={16} /></span>
        <span><small className="block text-[8px] uppercase tracking-[0.14em] text-[#7b8a84]">Your connection is</small><strong className="text-[11px]">Safe &amp; secure</strong></span>
      </div>
    </div>
    </section>
  );
}
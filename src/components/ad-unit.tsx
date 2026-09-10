"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/tools";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const MAX_WIDTH_CHECK_FRAMES = 30; // 약 0.5초까지만 너비가 잡히길 기다림

/**
 * 애드센스 수동 디스플레이 광고 단위.
 * slot이 비어 있으면(아직 AdSense에서 광고 단위를 안 만든 경우) 아무것도 렌더링하지 않아요.
 */
export function AdUnit({ slot, className }: { slot: string; className?: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;

    let cancelled = false;
    let frame = 0;
    let attempts = 0;

    // 레이아웃이 아직 안 잡혀서 너비가 0일 때 push하면 "No slot size for
    // availableWidth=0" 에러가 나므로, 너비가 잡힐 때까지 한 프레임씩 기다린다.
    const tryPush = () => {
      if (cancelled || pushed.current) return;
      const width = insRef.current?.parentElement?.getBoundingClientRect().width ?? 0;
      attempts += 1;
      if (width === 0 && attempts < MAX_WIDTH_CHECK_FRAMES) {
        frame = requestAnimationFrame(tryPush);
        return;
      }
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // 광고 차단기 등으로 adsbygoogle 스크립트가 없을 수 있음 — 무시.
      }
    };

    frame = requestAnimationFrame(tryPush);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`my-10 ${className ?? ""}`}>
      <p className="mb-1.5 text-center text-[11px] tracking-wide text-black/35 dark:text-white/35">
        광고
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsensePublisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

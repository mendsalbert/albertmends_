"use client";

import { useEffect, useState } from "react";

type BatteryState = {
  level: number;
  charging: boolean;
};

type NetworkInformation = {
  effectiveType?: string;
  type?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function WifiIcon({ online, strength }: { online: boolean; strength: number }) {
  if (!online) {
    return (
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-[#999]"
      >
        <path
          d="M8 11.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
          fill="currentColor"
        />
        <path
          d="M1.5 5.2C3.4 3.5 5.6 2.5 8 2.5c1.1 0 2.15.2 3.15.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M3.6 7.6C4.9 6.5 6.4 5.9 8 5.9c.75 0 1.45.15 2.1.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M5.6 9.8c.7-.55 1.55-.85 2.4-.85.4 0 .8.07 1.15.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M2 2.5 14 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[#333]"
    >
      <path
        d="M8 11.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
        fill="currentColor"
      />
      <path
        d="M1.5 5.2C3.4 3.5 5.6 2.5 8 2.5s4.6 1 6.5 2.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={strength >= 3 ? 1 : 0.25}
      />
      <path
        d="M3.6 7.6C4.9 6.5 6.4 5.9 8 5.9s3.1.6 4.4 1.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={strength >= 2 ? 1 : 0.25}
      />
      <path
        d="M5.6 9.8c.7-.55 1.55-.85 2.4-.85s1.7.3 2.4.85"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={strength >= 1 ? 1 : 0.25}
      />
    </svg>
  );
}

function BatteryIcon({ level, charging }: BatteryState) {
  const pct = Math.round(level * 100);
  const fillWidth = Math.max(1.2, (pct / 100) * 9.2);
  const low = pct <= 20 && !charging;

  return (
    <span className="inline-flex items-center gap-1.5" title={`${pct}%`}>
      <svg
        width="22"
        height="12"
        viewBox="0 0 22 12"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 ${low ? "text-[#b91c1c]" : "text-[#333]"}`}
      >
        <rect
          x="0.75"
          y="1.75"
          width="17.5"
          height="8.5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="19"
          y="4"
          width="2.25"
          height="4"
          rx="0.6"
          fill="currentColor"
        />
        <rect
          x="2.4"
          y="3.4"
          width={fillWidth}
          height="5.2"
          rx="0.6"
          fill="currentColor"
        />
        {charging ? (
          <path
            d="M10.2 2.2 8.3 6.3h2.1L9.3 9.8 12.4 5.4H10.2L11.4 2.2Z"
            fill="#f0f0f0"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
      <span className="tabular-nums text-[13px] leading-none">{pct}%</span>
    </span>
  );
}

function signalFromConnection(conn: NetworkInformation | undefined): number {
  if (!conn) return 3;
  const type = conn.effectiveType;
  if (type === "slow-2g" || type === "2g") return 1;
  if (type === "3g") return 2;
  return 3;
}

export function MenubarStatus() {
  const [clock, setClock] = useState("");
  const [online, setOnline] = useState(true);
  const [wifiStrength, setWifiStrength] = useState(3);
  const [battery, setBattery] = useState<BatteryState | null>(null);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const syncOnline = () => setOnline(navigator.onLine);
    syncOnline();
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);

    const conn = (
      navigator as Navigator & {
        connection?: NetworkInformation;
        mozConnection?: NetworkInformation;
        webkitConnection?: NetworkInformation;
      }
    ).connection ||
      (navigator as Navigator & { mozConnection?: NetworkInformation })
        .mozConnection ||
      (navigator as Navigator & { webkitConnection?: NetworkInformation })
        .webkitConnection;

    const syncConn = () => setWifiStrength(signalFromConnection(conn));
    syncConn();
    conn?.addEventListener?.("change", syncConn);

    return () => {
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
      conn?.removeEventListener?.("change", syncConn);
    };
  }, []);

  useEffect(() => {
    type BatteryManager = BatteryState & {
      addEventListener: (type: string, listener: () => void) => void;
      removeEventListener: (type: string, listener: () => void) => void;
    };

    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>;
    };

    if (!nav.getBattery) return;

    let batteryRef: BatteryManager | null = null;
    let cancelled = false;

    const sync = () => {
      if (!batteryRef || cancelled) return;
      setBattery({
        level: batteryRef.level,
        charging: batteryRef.charging,
      });
    };

    nav.getBattery().then((b) => {
      if (cancelled) return;
      batteryRef = b;
      sync();
      b.addEventListener("levelchange", sync);
      b.addEventListener("chargingchange", sync);
    });

    return () => {
      cancelled = true;
      if (!batteryRef) return;
      batteryRef.removeEventListener("levelchange", sync);
      batteryRef.removeEventListener("chargingchange", sync);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-3 text-[15px] text-[#333]"
      suppressHydrationWarning
    >
      <span
        className="inline-flex items-center"
        title={online ? "Online" : "Offline"}
        aria-label={online ? "Online" : "Offline"}
      >
        <WifiIcon online={online} strength={wifiStrength} />
      </span>
      {battery ? (
        <BatteryIcon level={battery.level} charging={battery.charging} />
      ) : null}
      <span className="min-w-[3.25rem] text-right tabular-nums">
        {clock || "\u00a0"}
      </span>
    </div>
  );
}

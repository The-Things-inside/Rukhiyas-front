"use client";
import { useRef, useLayoutEffect, useState as useReactState } from "react";

interface RegistrationStepperProps {
  activeTab: "online" | "call";
  setActiveTab: (tab: "online" | "call") => void;
}

export default function RegistrationStepper({
  activeTab,
  setActiveTab,
}: RegistrationStepperProps) {
  const onlineRef = useRef<HTMLSpanElement>(null);
  const callRef = useRef<HTMLSpanElement>(null);
  const [onlineWidth, setOnlineWidth] = useReactState<number | undefined>(
    undefined
  );
  const [callWidth, setCallWidth] = useReactState<number | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    if (onlineRef.current) setOnlineWidth(onlineRef.current.offsetWidth);
    if (callRef.current) setCallWidth(callRef.current.offsetWidth);
  }, []);

  return (
    <div className="px-6 pb-0 rounded-t-3xl pt-2">
      {/* Tabs group, clipped and centered */}
      <div className="flex justify-center mb-6">
        <div className="flex items-end p-1" style={{ gap: 20 }}>
          {/* Register Online Tab */}
          <button
            className="focus:outline-none flex flex-col items-center min-w-0"
            onClick={() => setActiveTab("online")}
            type="button"
          >
            <span
              ref={onlineRef}
              className="block"
              style={{
                fontFamily: "Spartan, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "22px",
                letterSpacing: 0,
                color: activeTab === "online" ? "#000" : "#A3A3A3",
                textAlign: "center",
                display: "inline-block",
                minWidth: 0,
              }}
            >
              Register Online
            </span>
            {activeTab === "online" && (
              <span
                className="block mt-1"
                style={{
                  width: onlineWidth,
                  height: 3,
                  background: "#E8B600",
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  margin: "0 auto",
                  display: "inline-block",
                  minWidth: 0,
                }}
              />
            )}
          </button>
          {/* Register Via Call Tab */}
          <button
            className="focus:outline-none flex flex-col items-center min-w-0"
            onClick={() => setActiveTab("call")}
            type="button"
          >
            <span
              ref={callRef}
              className="block"
              style={{
                fontFamily: "Spartan, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "22px",
                letterSpacing: 0,
                color: activeTab === "call" ? "#000" : "#A3A3A3",
                textAlign: "center",
                display: "inline-block",
                minWidth: 0,
              }}
            >
              Register Via Call
            </span>
            {activeTab === "call" && (
              <span
                className="block mt-1"
                style={{
                  width: callWidth,
                  height: 3,
                  background: "#E8B600",
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  margin: "0 auto",
                  display: "inline-block",
                  minWidth: 0,
                }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface OrbitalItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: OrbitalItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const RADIUS = 245;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      timelineData.forEach((item) => { newState[item.id] = false; });

      const opening = !prev[id];
      newState[id] = opening;

      if (opening) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const pulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { pulse[relId] = true; });
        setPulseEffect(pulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = RADIUS * Math.cos(radian);
    const y = RADIUS * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const current = timelineData.find((item) => item.id === itemId);
    return current ? current.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusColor = (status: OrbitalItem["status"]) => {
    switch (status) {
      case "completed": return "border-transparent bg-zinc-100 text-zinc-900";
      case "in-progress": return "border-transparent bg-blue-600 text-white";
      case "pending": return "border-zinc-700 bg-transparent text-zinc-400";
    }
  };

  const getStatusLabel = (status: OrbitalItem["status"]) => {
    switch (status) {
      case "completed": return "Proficient";
      case "in-progress": return "Active";
      case "pending": return "Learning";
    }
  };

  // Smart card positioning: avoid overlapping the orbit ring and other nodes
  const getCardPosition = (x: number, y: number): React.CSSProperties => {
    // Node is in the lower half → card goes above
    if (y > 60) {
      return { bottom: "72px", top: "auto", left: "50%", transform: "translateX(-50%)" };
    }
    // Node is in the upper half → card goes below
    if (y < -60) {
      return { top: "72px", bottom: "auto", left: "50%", transform: "translateX(-50%)" };
    }
    // Node on the right side → card goes to the left
    if (x > 0) {
      return { top: "50%", transform: "translateY(-50%)", right: "52px", left: "auto" };
    }
    // Node on the left side → card goes to the right
    return { top: "50%", transform: "translateY(-50%)", left: "52px", right: "auto" };
  };

  return (
    <div
      className="relative w-full h-[680px] flex items-center justify-center overflow-visible"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        ref={orbitRef}
        style={{ perspective: "1000px" }}
      >
        {/* Center orb */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center z-10 shadow-lg shadow-blue-500/30">
          <div className="absolute w-20 h-20 rounded-full border border-blue-500/20 animate-ping opacity-40" />
          <div
            className="absolute w-24 h-24 rounded-full border border-blue-500/10 animate-ping opacity-20"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="w-6 h-6 rounded-full bg-white/90" />
        </div>

        {/* Orbit ring */}
        <div
          className="absolute rounded-full border border-zinc-800"
          style={{ width: `${RADIUS * 2}px`, height: `${RADIUS * 2}px` }}
        />

        {/* Orbital nodes */}
        {timelineData.map((item, index) => {
          const pos = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;
          const cardStyle = getCardPosition(pos.x, pos.y);

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex: isExpanded ? 200 : pos.zIndex,
                opacity: isExpanded ? 1 : pos.opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Pulse aura */}
              <div
                className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                style={{
                  background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                  width: `${item.energy * 0.4 + 40}px`,
                  height: `${item.energy * 0.4 + 40}px`,
                  left: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                  top: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                }}
              />

              {/* Node dot */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isExpanded
                    ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/40 scale-150"
                    : isRelated
                    ? "bg-zinc-700 border-blue-500/60 animate-pulse"
                    : "bg-zinc-900 border-zinc-700 hover:border-zinc-500"
                  }`}
              >
                <Icon size={16} className={isExpanded ? "text-white" : "text-zinc-400"} />
              </div>

              {/* Label */}
              <div
                className={`absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-300
                  ${isExpanded ? "text-zinc-100 scale-110" : "text-zinc-500"}`}
              >
                {item.title}
              </div>

              {/* Expanded card — smart positioned */}
              {isExpanded && (
                <Card
                  className="absolute w-64 bg-zinc-950/95 backdrop-blur-xl border-zinc-700 shadow-2xl shadow-black/60"
                  style={{ ...cardStyle, position: "absolute" }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-zinc-600" />
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-center">
                      <Badge className={`text-xs px-2 ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <span className="text-xs font-mono text-zinc-500">{item.date}</span>
                    </div>
                    <CardTitle className="text-sm mt-2 text-zinc-100">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-400 px-4 pb-4">
                    <p className="leading-relaxed">{item.content}</p>

                    <div className="mt-4 pt-3 border-t border-zinc-800">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Zap size={10} />
                          Proficiency
                        </span>
                        <span className="font-mono text-zinc-400">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800">
                        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Related</p>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relId) => {
                            const rel = timelineData.find((i) => i.id === relId);
                            return (
                              <Button
                                key={relId}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 py-0 text-xs rounded-md border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relId);
                                }}
                              >
                                {rel?.title}
                                <ArrowRight size={8} className="ml-1" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

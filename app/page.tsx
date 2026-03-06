"use client";

import { Target, LayoutGrid, CheckCircle2, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Goals", value: "12", icon: Target, color: "text-primary", bg: "bg-primary/10" },
  { label: "Categories", value: "5", icon: LayoutGrid, color: "text-accent-purple", bg: "bg-accent-purple/10" },
  { label: "Tasks Done", value: "84%", icon: CheckCircle2, color: "text-accent-green", bg: "bg-accent-green/10" },
];

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] premium-gradient p-8 md:p-16 text-white text-center space-y-6 shadow-2xl shadow-primary/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Track Your Goals,<br />Master Your Growth.
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Turn your big dreams into small, achievable steps. Stay focused and productive with our premium tracker.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-4">
          <Link href="/goals" className="px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
            Get Started
          </Link>
          <Link href="/categories" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
            Browse Categories
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass p-8 rounded-[2rem] flex items-center justify-between group hover:scale-[1.05] transition-all duration-300">
              <div className="space-y-2">
                <p className="text-disabled font-bold uppercase tracking-wider text-xs">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-foreground">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions / Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[3rem] space-y-6 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Plus size={14} /> New Beginnings
            </div>
            <h2 className="text-3xl font-black text-foreground">Ready to start a new mission?</h2>
            <p className="text-secondary leading-relaxed">
              Define your vision and break it down into actionable tasks today.
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
            Create New Goal <ArrowRight size={20} />
          </button>
        </div>

        <div className="glass p-8 rounded-[3rem] space-y-6 flex flex-col justify-between group bg-card border-none">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-xs font-bold uppercase tracking-widest">
              <TrendingUp size={14} /> Momentum
            </div>
            <h2 className="text-3xl font-black text-foreground">You’re on a roll, Aldi!</h2>
            <p className="text-secondary leading-relaxed">
              You’ve completed 5 tasks in the last 24 hours. Keep pushing towards your 5km Run goal.
            </p>
          </div>
          <button className="flex items-center gap-2 text-accent-green font-bold group-hover:gap-4 transition-all">
            View Analytics <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

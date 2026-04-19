import Link from "next/link";
import { notFound } from "next/navigation";
import resume from "@/data/resume.json";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return resume.projects
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = resume.projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-150 mb-12"
        >
          ← All Projects
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 block">
          Case Study
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6 leading-tight">
          {project.name}
        </h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-10">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-16">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="flex flex-col items-center justify-center py-24 rounded-3xl text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-zinc-500 text-sm">Full case study coming soon.</p>
          <p className="text-zinc-600 text-xs mt-2">
            Docs, code blocks, and embedded visuals will appear here.
          </p>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, FolderGit2 } from "lucide-react";
import resume from "@/content/resume.json";
import { portfolioProjects } from "@/content/portfolio-projects";

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
  const detail = portfolioProjects[slug];

  if (!project || !detail) notFound();

  return (
    <main className="relative min-h-screen px-6 py-24">
      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/#projects"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All Projects
        </Link>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article>
            <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-blue-400">
              Case Study Template
            </span>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-zinc-100 md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
              {project.description}
            </p>

            <section className="mt-14">
              <h2 className="text-2xl font-bold text-zinc-100">Project Overview</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-400">
                {detail.overview}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.tech.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <h2 className="text-2xl font-bold text-zinc-100">Content</h2>
              <div className="mt-6 grid gap-4">
                {detail.sections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-lg border border-white/[0.08] bg-zinc-950/70 p-6"
                  >
                    <h3 className="text-lg font-semibold text-zinc-100">{section.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{section.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="rounded-lg border border-white/[0.08] bg-zinc-950/75 p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
              <FileText className="h-4 w-4" aria-hidden />
              Documents
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-start gap-3">
                  <FolderGit2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">Project folder</p>
                    <p className="mt-1 break-all font-mono text-xs text-zinc-500">
                      {detail.folderPath}
                    </p>
                  </div>
                </div>
              </div>

              {detail.repoUrl ? (
                <a
                  href={detail.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm font-semibold text-zinc-100 transition-colors hover:border-blue-500/40"
                >
                  Repository
                  <ExternalLink className="h-4 w-4 text-zinc-500" aria-hidden />
                </a>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-4">
                  <p className="text-sm font-semibold text-zinc-100">Repository</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Add a repo or sanitized reference link when this project is ready.
                  </p>
                </div>
              )}

              {detail.documents.map((document) => (
                <div
                  key={`${document.type}-${document.label}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    {document.type}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-100">{document.label}</p>
                  {document.note && (
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">{document.note}</p>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950">
        <main className="container max-w-4xl px-6 py-16 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-5xl lg:text-6xl">
              Luis Faria
            </h1>
            <p className="max-w-[700px] text-lg text-center text-muted-foreground mx-auto">
              Software Engineer | Project Lead
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/projects"
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg"
            >
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-xl tracking-tight">Projects</h3>
                <p className="text-muted-foreground">Explore my latest work and case studies</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link 
              href="/articles"
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg"
            >
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-xl tracking-tight">Articles</h3>
                <p className="text-muted-foreground">Read my thoughts on technology and development</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link 
              href="/chatbot"
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg"
            >
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-xl tracking-tight">AI Assistant</h3>
                <p className="text-muted-foreground">Chat with my custom AI assistant</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild className="rounded-full px-8">
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

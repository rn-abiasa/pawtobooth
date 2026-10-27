import Booth from "../components/Booth";

export default function Index() {
  return (
    <main className="tiles flex min-h-dvh flex-col overflow-hidden">
      <div className="flex flex-1 items-end justify-center px-3 pt-6">
        <Booth />
      </div>
      <div className="h-14 border-t-4 border-ink bg-butter sm:h-20" />
    </main>
  );
}

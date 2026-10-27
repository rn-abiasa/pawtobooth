import Booth from "../components/Booth";
import usePageTitle from "../lib/usePageTitle";

export default function Index() {
  usePageTitle("Pawtobooth – Photobooth Online Gratis dengan Kucing Lucu");
  return (
    <main className="tiles flex min-h-dvh flex-col overflow-hidden">
      <h1 className="sr-only">Pawtobooth, photobooth online gratis</h1>
      <div className="flex flex-1 items-end justify-center px-3 pt-6">
        <Booth />
      </div>
      <div className="h-14 border-t-4 border-ink bg-butter sm:h-20" />
    </main>
  );
}

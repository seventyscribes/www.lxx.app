export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-serif font-bold text-navy mb-4">
          LXX Bible Study
        </h1>
        <p className="text-lg text-charcoal/70 mb-8">
          A 365-day guided journey through the scriptures
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-full font-medium shadow-paper">
          <span className="text-gold">Coming Soon</span>
        </div>
      </div>
    </main>
  );
}

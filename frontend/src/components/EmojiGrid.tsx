
const EMOJIS = ['😠', '😤', '😌', '😊', '😢', '😐', '😁'];

export function EmojiGrid({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onChange(e)}
          className={`text-2xl md:text-3xl p-2 rounded-md border transition-colors ${
            value === e ? 'bg-blue-600 text-white' : 'bg-white/80 dark:bg-zinc-800 border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          }`}
          aria-label={`Pick emoji ${e}`}
        >
          <span role="img" aria-label="emoji">
            {e}
          </span>
        </button>
      ))}
    </div>
  );
}

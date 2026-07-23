

export const ChatInput = ({ input, setInput, onSend, loading }) => {
  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <form onSubmit={onSend} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command (e.g. 'Open calc')"
          className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded px-4 py-2 focus:outline-none focus:border-neutral-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded font-bold disabled:opacity-50 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};



export const ChatMessage = ({ msg, onApprove, onDeny, onOpenFile }) => {
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 border border-neutral-700'}`}>
        
        {/* Message Content */}
        <div className="text-sm">
          {msg.content}
        </div>

        {/* AI Thought (if any) */}
        {msg.ai_thought && (
          <div className="mt-2 text-xs italic text-gray-400 border-t border-gray-600 pt-2">
            Thought: {msg.ai_thought}
          </div>
        )}

        {/* Approval UI */}
        {msg.requires_approval && (
          <div className="mt-3 bg-gray-900 p-3 rounded border border-yellow-600">
            <p className="text-xs text-yellow-500 font-bold mb-1">⚠️ Security Check</p>
            {msg.action === 'search_files' ? (
              <p className="text-sm font-mono text-green-400">Search Windows for: {msg.search_query}</p>
            ) : (
              <code className="text-sm font-mono text-green-400 break-all">{msg.proposed_command}</code>
            )}
            
            {msg.status === 'pending' && (
              <div className="flex space-x-2 mt-3">
                <button onClick={onApprove} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold transition">Approve</button>
                <button onClick={onDeny} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold transition">Deny</button>
              </div>
            )}

            {msg.status === 'executing' && <p className="text-xs text-neutral-400 mt-2 animate-pulse">Executing...</p>}
            {msg.status === 'approved' && !msg.searchResults && <p className="text-xs text-green-400 mt-2">✓ Executed successfully</p>}
            {msg.status === 'denied' && <p className="text-xs text-red-400 mt-2">✗ Action denied by user</p>}
            {msg.status === 'failed' && <p className="text-xs text-red-500 mt-2">Failed: {msg.executionOutput}</p>}

            {/* Render File Search Results */}
            {msg.status === 'approved' && msg.searchResults && (
              <div className="mt-3 border-t border-gray-700 pt-2">
                <p className="text-xs text-gray-400 mb-2">Found {msg.searchResults.length} file(s):</p>
                <div className="flex flex-col space-y-2 max-h-40 overflow-y-auto pr-2">
                  {msg.searchResults.length === 0 && <p className="text-xs text-yellow-400">No files found.</p>}
                  {msg.searchResults.map((file, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        if(onOpenFile) onOpenFile(file);
                      }}
                      className="text-left text-xs bg-gray-800 hover:bg-gray-700 p-2 rounded truncate transition border border-gray-600"
                      title={file}
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

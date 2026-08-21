import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const InteractivePlayground = () => {
  const { language } = useContext(AuthContext);
  const [code, setCode] = useState(`// Type your JavaScript code here\nlet student = "Abebe";\nconsole.log("Selam, " + student + "! Welcome to Tech Hub.");`);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = () => {
    setIsRunning(true);
    setConsoleOutput('Executing program runtime logic...\n');
    
    setTimeout(() => {
      try {
        let capturedLogs = [];
        
        const customLog = (...args) => {
          const formattedLine = args
            .map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
            .join(' ');
          capturedLogs.push(formattedLine);
        };
        
        const mockConsole = {
          log: customLog,
          info: customLog,
          warn: customLog,
          error: customLog
        };
        
        // ✅ OPTIMIZED: Wrapped in an IIFE context block string to cleanly encapsulate student variable declarations
        const secureCodeString = `(function() { ${code} \n})();`;
        
        const runSandbox = new Function('console', secureCodeString);
        runSandbox(mockConsole);
        
        if (capturedLogs.length === 0) {
          setConsoleOutput('Program executed successfully with no console print output returned.');
        } else {
          setConsoleOutput(capturedLogs.join('\n'));
        }
      } catch (err) {
        setConsoleOutput(`❌ Runtime Error: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 transition duration-300 hover:border-slate-700 w-full shadow-2xl">
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-amber-400"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
            {language === 'EN' ? 'Integrated Code Terminal' : 'የተቀናጀ ኮድ መጻፊያ'}
          </span>
        </div>
        <button
          onClick={executeCode}
          disabled={isRunning}
          className={`text-xs px-5 py-2 rounded-xl font-black uppercase tracking-wider transition cursor-pointer ${
            isRunning 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
          }`}
        >
          {isRunning ? '⏱ Running...' : '▶ Run Code'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
        {/* Input Text Area Editor Box */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full min-h-[250px] bg-slate-900/40 p-5 font-mono text-sm text-emerald-400 focus:outline-none resize-none border-b md:border-b-0 md:border-r border-slate-800"
          spellCheck="false"
        />

        {/* Output Console Log Panel Box */}
        <div className="w-full h-full min-h-[250px] bg-slate-950 p-5 flex flex-col space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {language === 'EN' ? 'Console Log Output' : 'የኮንሶል ውጤት ማሳያ'}
          </span>
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap flex-grow bg-slate-900/60 p-4 rounded-xl border border-slate-900/40 overflow-auto text-left">
            {consoleOutput || (language === 'EN' 
              ? 'Click "Run Code" above to observe real-time script validation feedback loops.' 
              : 'ኮድዎን ለመፈተሽ ከላይ ያለውን "Run Code" የሚለውን ይጫኑ::')}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InteractivePlayground;

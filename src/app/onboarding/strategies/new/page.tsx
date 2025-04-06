import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function NewStrategy() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-[#222222]">
        <Link href="/onboarding/strategies" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-medium">Strategy details</h1>
          <p className="text-[#666666] mt-1">This is what users will see.</p>
        </div>

        {/* Strategy form */}
        <div className="space-y-6">
          {/* Strategy name */}
          <div>
            <label className="block text-sm text-[#666666] mb-2">Strategy name</label>
            <input 
              type="text" 
              placeholder="Enter strategy name"
              className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333]"
            />
          </div>

          {/* Short bio */}
          <div>
            <label className="block text-sm text-[#666666] mb-2">Short bio</label>
            <textarea 
              placeholder="Describe your strategy"
              className="w-full h-32 bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333] resize-none"
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-[#666666] mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              <div className="group px-4 py-2 bg-[#141414] rounded-lg text-sm font-medium text-white flex items-center gap-2">
                Day Trading
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="group px-4 py-2 bg-[#141414] rounded-lg text-sm font-medium text-white flex items-center gap-2">
                Forex
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="group px-4 py-2 bg-[#141414] rounded-lg text-sm font-medium text-white flex items-center gap-2">
                Technical
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-[#141414] rounded-lg text-sm font-medium text-[#666666] hover:bg-[#1A1A1A] transition-colors">
                + Add tag
              </button>
            </div>
          </div>

          {/* Sync account */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Sync account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#666666] mb-2">MT Username</label>
                <input 
                  type="text" 
                  placeholder="Enter username"
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">Investor Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password"
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] placeholder:text-[#666666] focus:outline-none focus:border-[#333333]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">Server</label>
                <select 
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] text-[#666666] focus:outline-none focus:border-[#333333] appearance-none"
                >
                  <option value="">Select server</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">Broker</label>
                <input 
                  type="text" 
                  value="MetaTrader 4"
                  disabled
                  className="w-full bg-[#141414] border border-[#222222] rounded-xl px-4 py-3 text-[15px] text-[#666666] focus:outline-none focus:border-[#333333] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <button
              className="w-full bg-[#7C3AED] hover:bg-[#6D31D9] text-white rounded-xl py-3.5 font-medium transition-colors"
            >
              Sync Now
            </button>
            <div className="flex items-center justify-between px-4 py-3 bg-[#141414] rounded-xl">
              <span className="text-sm">Show this strategy on profile</span>
              <div className="w-12 h-6 bg-[#7C3AED] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <button
              className="w-full bg-[#141414] hover:bg-[#1A1A1A] text-white rounded-xl py-3.5 font-medium transition-colors"
            >
              Save Strategy
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 
'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, Heart, Target, Copy, Check } from 'lucide-react';

const BUDDIES_STORAGE_KEY = 'bloomflow_accountability_buddies';

export function CottageSocialAccountability() {
  const [buddies, setBuddies] = useState<string[]>([]);
  const [newBuddyName, setNewBuddyName] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BUDDIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setBuddies(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setBuddies([]);
    }
  }, []);

  const saveBuddies = (next: string[]) => {
    setBuddies(next);
    localStorage.setItem(BUDDIES_STORAGE_KEY, JSON.stringify(next));
  };

  const addBuddy = () => {
    const name = newBuddyName.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    if (buddies.includes(name)) return;
    saveBuddies([...buddies, name]);
    setNewBuddyName('');
  };

  const removeBuddy = (name: string) => {
    saveBuddies(buddies.filter((b) => b !== name));
  };

  const inviteLink = typeof window !== 'undefined' ? window.location.origin : '';
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: show URL in alert
      alert(`Share this link with friends:\n${inviteLink}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent-100">
          <Users className="w-8 h-8 text-accent-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-accent-800">Friends & Accountability</h2>
          <p className="text-sm text-neutral-600">
            Stay connected and keep each other accountable for weight loss and exercise goals.
          </p>
        </div>
      </div>

      <p className="text-neutral-700 mb-6">
        Add friends as accountability buddies so you can check in together, share wins, and encourage each other when you log workouts or hit milestones. You&apos;ve got each other&apos;s backs.
      </p>

      {/* Your accountability circle */}
      <div className="mb-6">
        <h3 className="font-semibold text-accent-800 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-600" />
          Your accountability circle
        </h3>
        {buddies.length === 0 ? (
          <p className="text-sm text-neutral-500 mb-3">Add a friend or family member to keep each other on track.</p>
        ) : (
          <ul className="space-y-2 mb-3">
            {buddies.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent-50 border border-accent-200"
              >
                <span className="font-medium text-accent-900">{name}</span>
                <button
                  type="button"
                  onClick={() => removeBuddy(name)}
                  className="text-sm text-accent-600 hover:text-accent-800 underline"
                  aria-label={`Remove ${name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newBuddyName}
            onChange={(e) => setNewBuddyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBuddy()}
            placeholder="Friend's name"
            className="flex-1 min-w-[140px] px-3 py-2 border border-accent-200 rounded-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
            aria-label="Add accountability buddy name"
          />
          <button
            type="button"
            onClick={addBuddy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 text-white font-semibold hover:bg-accent-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 cursor-pointer"
            aria-label="Add accountability buddy"
          >
            <UserPlus className="w-4 h-4" />
            Add buddy
          </button>
        </div>
      </div>

      {/* How to stay accountable */}
      <div className="mb-6 p-4 rounded-lg bg-primary-50 border border-primary-200">
        <h3 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-600" />
          How to stay accountable together
        </h3>
        <ul className="text-sm text-primary-900 space-y-1 list-disc list-inside">
          <li>Set a weekly check-in (e.g. &quot;We both log 3 workouts this week&quot;).</li>
          <li>Share when you log a workout or hit a milestone so your buddy can cheer you on.</li>
          <li>Send a quick message of encouragement when the other is struggling.</li>
        </ul>
      </div>

      {/* Invite friends to BloomFlow */}
      <div>
        <h3 className="font-semibold text-accent-800 mb-2">Invite friends to BloomFlow</h3>
        <p className="text-sm text-neutral-600 mb-3">
          Share the app with friends so they can join and you can keep each other accountable in one place.
        </p>
        <button
          type="button"
          onClick={copyInviteLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-accent-300 text-accent-700 font-semibold hover:bg-accent-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Link copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy invite link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

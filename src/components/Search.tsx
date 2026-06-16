import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, ArrowRight, FileText } from 'lucide-react';

interface SearchItem {
  title: string;
  path: string;
  text: string;
  category: string;
}

const searchIndex: SearchItem[] = [
  { title: 'Home', path: '/', text: 'Australian visa migration agents registered MARN', category: 'Home' },
  { title: 'Partner Visa 820/801', path: '/visas/partner-visa-820', text: 'Onshore partner spouse de facto permanent residency', category: 'Partner & Family' },
  { title: 'Partner Visa 309/100', path: '/visas/partner-visa-309', text: 'Offshore partner spouse permanent residency', category: 'Partner & Family' },
  { title: 'Prospective Marriage Visa 300', path: '/visas/prospective-marriage-300', text: 'Fiance marriage engaged prospective', category: 'Partner & Family' },
  { title: 'Parent Visa 103', path: '/visas/parent-visa-103', text: 'Parent family reunion children permanent contributory', category: 'Partner & Family' },
  { title: 'Skills in Demand Visa 482', path: '/visas/skills-in-demand-482', text: 'SID temporary work employer sponsorship core specialist skills', category: 'Work' },
  { title: 'Skilled Employer Regional 494', path: '/visas/skilled-regional-494', text: 'Regional provisional permanent employer nominated', category: 'Work' },
  { title: 'Skilled Independent 189/190', path: '/visas/skilled-independent-189', text: 'Points tested permanent residency state nominated', category: 'Work' },
  { title: 'Employer Nomination 186', path: '/visas/employer-nomination-186', text: 'ENS permanent residency direct entry labour agreement', category: 'Work' },
  { title: 'Work and Holiday 417/462', path: '/visas/work-holiday-417', text: 'Working holiday backpacker young', category: 'Work' },
  { title: 'Visitor Visa 600', path: '/visas/visitor-visa-600', text: 'Visitor tourist business travel sponsorship', category: 'Visitor' },
  { title: 'Short Stay 400/408', text: 'Short stay temporary activity event religious', path: '/visas/short-stay-400', category: 'Visitor' },
  { title: 'Student Visa 500', path: '/visas/student-visa-500', text: 'Student study education university college CRICOS', category: 'Study' },
  { title: 'Training Visa 407', path: '/visas/training-visa-407', text: 'Training occupational development professional', category: 'Study' },
  { title: 'Protection Visa 866', path: '/services/protection-visa-866', text: 'Protection refugee humanitarian asylum complementary', category: 'Protection' },
  { title: 'Skills Assessments', path: '/services/skills-assessments', text: 'Skills assessment qualification recognition TRA VETASSESS ACS', category: 'Services' },
  { title: 'Citizenship Applications', path: '/services/citizenship', text: 'Australian citizen permanent residency conferral descent', category: 'Services' },
  { title: 'ART Appeals', path: '/services/visa-refusals', text: 'AAT ART review tribunal appeal visa refusal cancellation', category: 'Services' },
  { title: 'Bridging Visas', path: '/services/bridging-visas', text: 'Bridging visa A B C E temporary lawful status', category: 'Services' },
  { title: 'Employer Hub & DAMA', path: '/employers', text: 'Employer sponsorship DAMA labour agreement business', category: 'Employers' },
  { title: 'Our Team', path: '/our-team', text: 'Migration agents Natasha Arens Sergey Vinnichenko', category: 'About' },
  { title: 'Pricing & Fees', path: '/pricing', text: 'Professional fees pricing consultation visa costs', category: 'About' },
  { title: 'Blog', path: '/blog', text: 'Immigration news articles visa updates 2025 2026', category: 'About' },
  { title: 'Contact Us', path: '/contact', text: 'Contact book consultation appointment Sydney', category: 'Contact' },
  { title: 'Privacy Policy', path: '/terms', text: 'Privacy policy terms of service legal', category: 'Legal' },
  { title: 'Free Visa Assessment', path: 'https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top', text: 'Free online visa assessment enquiry', category: 'Assessment' },
];

const categoryColors: Record<string, string> = {
  'Home': 'bg-blue-500/15 text-blue-500',
  'Partner & Family': 'bg-rose-500/15 text-rose-500',
  'Work': 'bg-emerald-500/15 text-emerald-500',
  'Visitor': 'bg-amber-500/15 text-amber-500',
  'Study': 'bg-violet-500/15 text-violet-500',
  'Protection': 'bg-orange-500/15 text-orange-500',
  'Services': 'bg-cyan-500/15 text-cyan-500',
  'Employers': 'bg-indigo-500/15 text-indigo-500',
  'About': 'bg-slate-500/15 text-slate-500',
  'Contact': 'bg-teal-500/15 text-teal-500',
  'Legal': 'bg-gray-500/15 text-gray-500',
  'Assessment': 'bg-yellow-500/15 text-yellow-600',
};

const suggestedSearches = ['Partner Visa', '482 Work', 'Student 500', 'Visitor 600', 'Citizenship', '189 Points'];

const Search = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = searchIndex.map(item => {
      const fullText = `${item.title} ${item.text} ${item.category}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (item.title.toLowerCase().includes(term)) score += 10;
        if (item.text.toLowerCase().includes(term)) score += 5;
        if (item.category.toLowerCase().includes(term)) score += 3;
        if (fullText.includes(term)) score += 1;
      }
      return { item, score };
    });
    const filtered = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 10);
    setResults(filtered.map(s => s.item));
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const goTo = (path: string) => {
    setOpen(false);
    setQuery('');
    if (path.startsWith('http')) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      goTo(results[selectedIndex].path);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 glass-card px-3 py-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-faint)' }}
        aria-label="Search"
        title="Search (Ctrl+K)"
      >
        <SearchIcon className="w-4 h-4" />
        <span>Search</span>
        <span className="text-xs ml-1" style={{ color: 'var(--text-ghost)' }}>Ctrl K</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh]"
      onClick={() => { setOpen(false); setQuery(''); }}
    >
      {/* Backdrop — subtle, not opaque */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay-bg)', backdropFilter: 'blur(8px)' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl mx-3 sm:mx-4 overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <SearchIcon className="w-5 h-5 shrink-0" style={{ color: 'var(--text-ghost)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search visa services, pages, topics..."
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={() => { setOpen(false); setQuery(''); }}
            className="transition-colors p-1 rounded-md hover:bg-white/5"
            style={{ color: 'var(--text-ghost)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() === '' && (
            <div className="px-4 py-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-ghost)' }}>
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 text-sm rounded-lg transition-all"
                    style={{
                      background: 'var(--bg-input)',
                      color: 'var(--text-faint)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.borderColor = 'var(--gold)';
                      (e.target as HTMLElement).style.color = 'var(--gold)';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)';
                      (e.target as HTMLElement).style.color = 'var(--text-faint)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium group"
                  style={{ color: 'var(--gold)' }}
                  onClick={() => { setOpen(false); setQuery(''); }}
                >
                  <FileText className="w-4 h-4" />
                  Not sure? Take our Free Visa Assessment
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {results.length === 0 && query.trim() !== '' && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No results for &quot;{query}&quot;</p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-ghost)' }}>Try different keywords or check spelling</p>
              <div className="mt-4">
                <a
                  href="https://visa2au.mmportal.cloud/assessment/enquiry/general-enquiry#nav-top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium inline-flex items-center gap-2"
                  style={{ color: 'var(--gold)' }}
                >
                  <FileText className="w-4 h-4" />
                  Try Free Visa Assessment Instead
                </a>
              </div>
            </div>
          )}

          {results.map((item, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                onMouseEnter={() => setSelectedIndex(i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{
                  backgroundColor: isSelected ? 'rgba(251, 191, 36, 0.08)' : 'transparent',
                  borderLeft: isSelected ? '3px solid var(--gold)' : '3px solid transparent',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: isSelected ? 'var(--gold)' : 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-ghost)' }}>
                    {item.text}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${categoryColors[item.category] || 'bg-gray-500/15 text-gray-500'}`}
                >
                  {item.category}
                </span>
                <ArrowRight
                  className="w-4 h-4 shrink-0 transition-transform"
                  style={{ color: isSelected ? 'var(--gold)' : 'var(--text-ghost)' }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5 text-xs"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-ghost)',
          }}
        >
          <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>&#8593;</kbd>
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>&#8595;</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>Enter</kbd>
              <span className="ml-1">Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>Esc</kbd>
              <span className="ml-1">Close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

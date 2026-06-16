import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, FileText, Clock, CheckCircle, Eye, Archive, Reply, Loader2, Lock, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

interface Submission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  citizenship: string | null;
  enquiry_type: string;
  visa_type: string | null;
  preferred_date: string | null;
  applicants: number;
  message: string;
  status: string;
  created_at: string;
  file_count: number;
}

interface SubmissionFile {
  id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  r2_url: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-amber-500/15 text-amber-500',
  read: 'bg-blue-500/15 text-blue-500',
  replied: 'bg-emerald-500/15 text-emerald-500',
  archived: 'bg-gray-500/15 text-gray-500',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

const AdminSubmissions = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || localStorage.getItem('admin-token') || '');
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissionFiles, setSubmissionFiles] = useState<SubmissionFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSubmissions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/submissions?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (res.ok) {
        setSubmissions(data.submissions || []);
        setAuthenticated(true);
        localStorage.setItem('admin-token', token);
      } else {
        setError(data.error || 'Failed to load submissions');
        setAuthenticated(false);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authenticated) fetchSubmissions();
  }, [authenticated, fetchSubmissions]);

  const viewSubmission = async (sub: Submission) => {
    setSelectedSubmission(sub);
    if (sub.file_count > 0) {
      try {
        const res = await fetch(`/api/submissions?id=${sub.id}&token=${encodeURIComponent(token)}`);
        const data = await res.json();
        setSubmissionFiles(data.files || []);
      } catch {
        setSubmissionFiles([]);
      }
    } else {
      setSubmissionFiles([]);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/submissions?id=${id}&token=${encodeURIComponent(token)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      // silently fail
    }
  };

  const filteredSubmissions = statusFilter === 'all'
    ? submissions
    : submissions.filter(s => s.status === statusFilter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Login screen
  if (!authenticated) {
    return (
      <Layout>
        <section className="relative pt-32 pb-20 t-bg-body min-h-[80vh] flex items-center justify-center">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-md mx-auto glass-panel p-8">
              <div className="text-center mb-6">
                <Lock className="w-10 h-10 text-visa-gold mx-auto mb-3" />
                <h1 className="text-2xl font-bold t-text-primary">Admin Dashboard</h1>
                <p className="t-text-muted text-sm mt-1">Enter your access token to view submissions</p>
              </div>
              <div className="space-y-4">
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Access token"
                  className="w-full h-10 px-3 rounded-md t-bg-input border t-border t-text-primary placeholder:t-text-ghost focus:border-visa-gold outline-none"
                  onKeyDown={e => e.key === 'Enter' && fetchSubmissions()}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  onClick={fetchSubmissions}
                  disabled={!token || loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Access Dashboard'}
                </button>
              </div>
              <p className="t-text-ghost text-xs text-center mt-4">
                The access token is set via the <code className="t-text-faint">ADMIN_TOKEN</code> environment variable.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Detail view
  if (selectedSubmission) {
    return (
      <Layout>
        <section className="relative pt-28 pb-20 t-bg-body min-h-screen">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <button onClick={() => setSelectedSubmission(null)} className="btn-ghost flex items-center gap-2 mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to list
            </button>

            <div className="glass-panel p-6 md:p-8 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedSubmission.status] || ''}`}>
                    {statusLabels[selectedSubmission.status] || selectedSubmission.status}
                  </span>
                  <h1 className="text-2xl font-bold t-text-primary mt-2">
                    #{selectedSubmission.id} — {selectedSubmission.first_name} {selectedSubmission.last_name}
                  </h1>
                  <p className="t-text-muted text-sm mt-1">{formatDate(selectedSubmission.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  {selectedSubmission.status === 'new' && (
                    <button onClick={() => updateStatus(selectedSubmission.id, 'read')} className="btn-ghost text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                  {selectedSubmission.status !== 'replied' && (
                    <button onClick={() => updateStatus(selectedSubmission.id, 'replied')} className="btn-ghost text-xs flex items-center gap-1">
                      <Reply className="w-3 h-3" /> Mark Replied
                    </button>
                  )}
                  {selectedSubmission.status !== 'archived' && (
                    <button onClick={() => updateStatus(selectedSubmission.id, 'archived')} className="btn-ghost text-xs flex items-center gap-1">
                      <Archive className="w-3 h-3" /> Archive
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold t-text-primary text-sm border-b t-border pb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 t-text-faint" /><a href={`mailto:${selectedSubmission.email}`} className="t-text-secondary hover:text-visa-gold">{selectedSubmission.email}</a></p>
                    {selectedSubmission.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 t-text-faint" /><span className="t-text-secondary">{selectedSubmission.phone}</span></p>}
                    {selectedSubmission.country && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 t-text-faint" /><span className="t-text-secondary">{selectedSubmission.country}</span></p>}
                    {selectedSubmission.citizenship && <p className="flex items-center gap-2"><span className="t-text-ghost w-4 text-center">C</span><span className="t-text-secondary">{selectedSubmission.citizenship}</span></p>}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold t-text-primary text-sm border-b t-border pb-2">Enquiry Details</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><span className="t-text-ghost w-20 shrink-0">Type</span><span className="t-text-secondary font-medium">{selectedSubmission.enquiry_type}</span></p>
                    {selectedSubmission.visa_type && <p className="flex items-center gap-2"><span className="t-text-ghost w-20 shrink-0">Visa</span><span className="t-text-secondary">{selectedSubmission.visa_type}</span></p>}
                    {selectedSubmission.preferred_date && <p className="flex items-center gap-2"><Calendar className="w-4 h-4 t-text-faint" /><span className="t-text-secondary">{selectedSubmission.preferred_date}</span></p>}
                    <p className="flex items-center gap-2"><span className="t-text-ghost w-20 shrink-0">Applicants</span><span className="t-text-secondary">{selectedSubmission.applicants}</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold t-text-primary text-sm border-b t-border pb-2 mb-3">Message</h3>
                <div className="t-bg-input rounded-xl p-4 text-sm t-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              {submissionFiles.length > 0 && (
                <div>
                  <h3 className="font-semibold t-text-primary text-sm border-b t-border pb-2 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Attachments ({submissionFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {submissionFiles.map(f => (
                      <a key={f.id} href={f.r2_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 glass-card px-4 py-3 hover:border-visa-gold transition-colors">
                        <FileText className="w-5 h-5 text-visa-gold" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm t-text-secondary truncate">{f.file_name}</p>
                          <p className="text-xs t-text-ghost">{formatSize(f.file_size)} &middot; {f.file_type}</p>
                        </div>
                        <span className="text-xs t-text-faint">Download</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // List view
  return (
    <Layout>
      <section className="relative pt-28 pb-20 t-bg-body min-h-screen">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold t-text-primary">Form Submissions</h1>
              <p className="t-text-muted text-sm">{submissions.length} total submissions</p>
            </div>
            <div className="flex gap-2">
              {['all', 'new', 'read', 'replied', 'archived'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-visa-gold/20 text-visa-gold'
                      : 't-bg-input t-text-faint hover:t-text-secondary'
                  }`}>
                  {s === 'all' ? 'All' : statusLabels[s]}
                  {s !== 'all' && <span className="ml-1 opacity-60">({submissions.filter(x => x.status === s).length})</span>}
                </button>
              ))}
              <button onClick={fetchSubmissions} className="btn-ghost text-xs" title="Refresh">
                <Clock className="w-3 h-3" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><Loader2 className="w-8 h-8 t-text-faint animate-spin mx-auto" /></div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20 glass-panel">
              <CheckCircle className="w-10 h-10 t-text-ghost mx-auto mb-3" />
              <p className="t-text-muted">No submissions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map(sub => (
                <button key={sub.id} onClick={() => viewSubmission(sub)}
                  className="w-full text-left glass-card p-4 flex items-center gap-4 group hover:border-visa-gold transition-all">
                  <div className="shrink-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[sub.status] || ''}`}>
                      {statusLabels[sub.status] || sub.status}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="t-text-primary font-medium text-sm truncate">
                      {sub.first_name} {sub.last_name}
                      <span className="t-text-ghost font-normal ml-2">&lt;{sub.email}&gt;</span>
                    </p>
                    <p className="t-text-faint text-xs truncate">
                      {sub.enquiry_type}
                      {sub.visa_type && ` · ${sub.visa_type}`}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    {sub.file_count > 0 && <span className="t-text-ghost text-xs flex items-center gap-1"><FileText className="w-3 h-3" />{sub.file_count}</span>}
                    <span className="t-text-ghost text-xs">{formatDate(sub.created_at)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminSubmissions;

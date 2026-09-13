import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Mail,
  Filter
} from 'lucide-react';
import { useAlumni } from '../../context/AlumniContext';
import { Opportunity } from '../../types';

export const OpportunitiesView: React.FC = () => {
  const {
    currentUser,
    opportunities,
    createOpportunity,
    setSelectedUserIdForModal
  } = useAlumni();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState<Opportunity | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'full-time' | 'part-time' | 'internship' | 'mentorship' | 'contract'>('full-time');
  const [description, setDescription] = useState('');
  const [salaryOrStipend, setSalaryOrStipend] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        (opp.skills || []).some((s) => s.toLowerCase().includes(q));

      const matchesType = selectedType === 'all' || opp.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [opportunities, searchQuery, selectedType]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !description) return;
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createOpportunity({
      title,
      company,
      location: location || 'Remote / Hybrid',
      type,
      description,
      salaryOrStipend: salaryOrStipend || undefined,
      contactEmail: contactEmail || currentUser?.email || 'careers@alumni.edu',
      skills: skills.length > 0 ? skills : ['Communication', 'Leadership']
    });

    setTitle('');
    setCompany('');
    setLocation('');
    setDescription('');
    setSalaryOrStipend('');
    setContactEmail('');
    setSkillsInput('');
    setShowPostModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Alumni Job Board & Mentorship
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {opportunities.length} Open Roles
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Exclusive career opportunities, internships, and mentorship listings posted by alumni founders & hiring managers.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company name, skill, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 w-full sm:w-auto"
        >
          <option value="all">All Employment Types</option>
          <option value="full-time">Full-Time</option>
          <option value="internship">Internship</option>
          <option value="mentorship">Mentorship</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                    {opp.type}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 leading-snug">{opp.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-600 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      {opp.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {opp.location}
                    </span>
                  </div>
                </div>

                {opp.salaryOrStipend && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                    {opp.salaryOrStipend}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                {opp.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(opp.skills || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-medium rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-[11px] text-stone-500">
                Posted by{' '}
                <button
                  onClick={() => setSelectedUserIdForModal(opp.postedByUid)}
                  className="font-semibold text-stone-800 hover:underline"
                >
                  {opp.postedByName}
                </button>
              </div>

              <button
                onClick={() => setSelectedOpportunityForModal(opp)}
                className="w-full sm:w-auto justify-center px-4 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>View & Apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OPPORTUNITY DETAIL & APPLY MODAL */}
      {selectedOpportunityForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedOpportunityForModal.type}
                </span>
                <h2 className="text-lg font-bold text-stone-900 mt-1">
                  {selectedOpportunityForModal.title}
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  {selectedOpportunityForModal.company} • {selectedOpportunityForModal.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedOpportunityForModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs text-stone-700 leading-relaxed max-h-60 overflow-y-auto">
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Role Description</h4>
                <p className="whitespace-pre-line">{selectedOpportunityForModal.description}</p>
              </div>

              {selectedOpportunityForModal.salaryOrStipend && (
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">Compensation</h4>
                  <p className="text-emerald-700 font-semibold">
                    {selectedOpportunityForModal.salaryOrStipend}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-stone-900 mb-1">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedOpportunityForModal.skills || []).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-stone-100 text-stone-700 text-xs font-medium rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                Contact: <span className="font-semibold text-stone-800">{selectedOpportunityForModal.contactEmail}</span>
              </div>

              <a
                href={`mailto:${selectedOpportunityForModal.contactEmail}?subject=Application for ${encodeURIComponent(
                  selectedOpportunityForModal.title
                )} via Alumni Network`}
                className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors text-center"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Alum / Apply</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* POST OPPORTUNITY MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Post an Opportunity to Alumni</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Job or Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Product Designer, ML Research Fellow"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe, OpenAI, Stanford Health"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Opportunity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="internship">Internship</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (or Remote)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Salary / Stipend</label>
                  <input
                    type="text"
                    value={salaryOrStipend}
                    onChange={(e) => setSalaryOrStipend(e.target.value)}
                    placeholder="e.g. $160,000 - $210,000 + Equity"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description & Requirements *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline requirements, responsibilities, and application directions..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, TypeScript, GraphQL, Product Design"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Contact / Application Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={currentUser?.email || 'alumni-recruiting@company.com'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-center transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-xl font-bold shadow-xs text-center transition-colors"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

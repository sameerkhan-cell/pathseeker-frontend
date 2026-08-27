import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  Share2,
  Download,
  Plus,
  Edit2,
  X,
  Check,
  Compass,
  Video,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { bookmarksApi } from "../api/bookmarksApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function Bookmarks() {
  const navigate = useNavigate();

  const [items, setItems] = useState(null);
  const [itemType, setItemType] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [loading, setLoading] = useState(true);

  // note editing state: { [bookmarkId]: { text, noteId? } }
  const [noteDrafts, setNoteDrafts] = useState({});
  const [activeNoteInput, setActiveNoteInput] = useState(null); // bookmarkId

  const filterTabs = [
    { label: "All Items", value: "" },
    { label: "Careers", value: "CAREER", icon: <Compass className="w-4 h-4" /> },
    { label: "Media", value: "MEDIA", icon: <Video className="w-4 h-4" /> },
    { label: "Resources", value: "RESOURCE", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Stories", value: "STORY", icon: <Award className="w-4 h-4" /> },
  ];

  const loadBookmarks = () => {
    setLoading(true);
    setError("");
    bookmarksApi
      .list({ page: 1, limit: 50, ...(itemType && { itemType }) })
      .then((res) => {
        const list = res.data.items || res.data.bookmarks || [];
        setItems(list);
      })
      .catch((err) => setError(err.message || "Failed to load bookmarks"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType]);

  const handleRemove = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from your bookmarks?`)) return;
    try {
      await bookmarksApi.remove(id);
      setStatus(`Removed "${title}" from bookmarks.`);
      loadBookmarks();
      setTimeout(() => setStatus(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to remove bookmark");
    }
  };

  const handleSaveNote = async (bm) => {
    const draft = noteDrafts[bm.id];
    if (!draft?.text?.trim()) return;
    try {
      if (draft.noteId) {
        await bookmarksApi.updateNote(draft.noteId, draft.text.trim());
        setStatus("Note updated successfully.");
      } else {
        await bookmarksApi.addNote(bm.id, draft.text.trim());
        setStatus("Note added to bookmark.");
      }
      setNoteDrafts((d) => ({ ...d, [bm.id]: undefined }));
      setActiveNoteInput(null);
      loadBookmarks();
      setTimeout(() => setStatus(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await bookmarksApi.deleteNote(noteId);
      setStatus("Note deleted.");
      loadBookmarks();
      setTimeout(() => setStatus(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
  };

  const handleExport = () => {
    window.open("http://localhost:5000/api/bookmarks/export", "_blank");
    setStatus("Bookmarks export opened in a new tab.");
    setTimeout(() => setStatus(""), 4000);
  };

  const handleShare = async () => {
    try {
      const res = await bookmarksApi.getShareLink();
      const url = `http://localhost:5000${res.data.shareUrl}`;
      setShareUrl(url);
    } catch (err) {
      setError(err.message || "Failed to generate share link");
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const getItemIcon = (t) => {
    switch (t) {
      case "CAREER":
        return <Compass className="w-5 h-5" />;
      case "MEDIA":
        return <Video className="w-5 h-5" />;
      case "RESOURCE":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getItemLink = (bm) => {
    switch (bm.itemType) {
      case "CAREER":
        return `/careers/${bm.itemId}`;
      case "MEDIA":
        return `/media/${bm.itemId}`;
      case "RESOURCE":
        return `/resources`;
      case "STORY":
        return `/stories`;
      default:
        return `/careers`;
    }
  };

  return (
    <div className="container-app py-8 md:py-12 space-y-8 max-w-5xl">
      {/* ─── HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" /> Saved Pathway Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            My Saved Bookmarks & Notes
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Access your saved careers, video lessons, and resource guides with personal study notes.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <GoldOutlineButton size="md" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" /> Export JSON
          </GoldOutlineButton>

          <PrimaryButton size="md" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1.5" /> Share Collection
          </PrimaryButton>
        </div>
      </div>

      {/* Share Link Banner */}
      {shareUrl && (
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-accent-gold/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1 min-w-0">
            <span className="text-caption font-semibold text-accent-gold uppercase font-mono">
              Public Shareable Link
            </span>
            <p className="text-body-sm text-text-primary truncate font-mono bg-base p-2 rounded border border-border-subtle">
              {shareUrl}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PrimaryButton size="sm" onClick={handleCopyLink}>
              <Copy className="w-3.5 h-3.5 mr-1" />
              {copiedShare ? "Copied!" : "Copy Link"}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setShareUrl("")}
              className="p-2 rounded-button text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Notifications */}
      {status && (
        <div className="p-3.5 rounded-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-body-sm animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-button bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-body-sm animate-fade-in flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── FILTER PILLS ROW ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-4">
        {filterTabs.map((tab) => {
          const isActive = itemType === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setItemType(tab.value)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-navy-800 text-white dark:bg-accent-gold dark:text-navy-900 shadow-sm"
                    : "bg-card border border-border-subtle text-text-muted hover:text-text-primary hover:border-accent-gold/40"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── BOOKMARKS LIST ────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card border border-border-subtle rounded-card p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((bm) => (
            <div
              key={bm.id}
              className="
                bg-card border border-border-subtle hover:border-accent-gold/40
                rounded-card p-6 shadow-[var(--shadow-card)] transition-all duration-200 space-y-4 theme-transition
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0 mt-0.5">
                    {getItemIcon(bm.itemType)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-gold/15 text-accent-gold uppercase font-mono">
                        {bm.itemType}
                      </span>
                      <span className="text-caption text-text-muted">
                        Saved on {new Date(bm.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={getItemLink(bm)}
                      className="text-lg sm:text-xl font-heading font-bold text-text-primary hover:text-accent-gold transition-colors block truncate"
                    >
                      {bm.title}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={getItemLink(bm)}>
                    <GoldOutlineButton size="sm">
                      View Item <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </GoldOutlineButton>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemove(bm.id, bm.title)}
                    className="p-2 rounded-button text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes Section */}
              <div className="pt-3 border-t border-border-subtle space-y-3">
                {bm.notes && bm.notes.length > 0 && (
                  <div className="space-y-2">
                    {bm.notes.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-lg bg-base border border-border-subtle flex items-start justify-between gap-3 text-body-sm"
                      >
                        <p className="text-text-primary flex-1 whitespace-pre-wrap">{n.note}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoteInput(bm.id);
                              setNoteDrafts((d) => ({
                                ...d,
                                [bm.id]: { text: n.note, noteId: n.id },
                              }));
                            }}
                            className="p-1 text-text-muted hover:text-accent-gold transition-colors"
                            title="Edit note"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(n.id)}
                            className="p-1 text-text-muted hover:text-red-500 transition-colors"
                            title="Delete note"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add / Edit Note Input Box */}
                {activeNoteInput === bm.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 pt-1 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Type a personal study note or reminder..."
                      value={noteDrafts[bm.id]?.text ?? ""}
                      onChange={(e) =>
                        setNoteDrafts((d) => ({
                          ...d,
                          [bm.id]: { ...d[bm.id], text: e.target.value },
                        }))
                      }
                      className="
                        flex-1 px-3 py-2 text-body-sm text-text-primary
                        bg-[var(--bg-input)] border border-border-subtle rounded-button
                        focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
                      "
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <PrimaryButton size="sm" onClick={() => handleSaveNote(bm)}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Save
                      </PrimaryButton>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNoteInput(null);
                          setNoteDrafts((d) => ({ ...d, [bm.id]: undefined }));
                        }}
                        className="px-3 py-2 text-body-sm text-text-muted hover:bg-base rounded-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveNoteInput(bm.id)}
                    className="text-xs text-accent-gold hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Personal Study Note
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-heading-2 font-heading text-text-primary">
            No Bookmarks in this Category
          </h2>
          <p className="text-body-sm text-text-muted max-w-md mx-auto">
            Save careers, videos, and guides while exploring to organize your personalized curriculum here.
          </p>
          <Link to="/careers">
            <PrimaryButton size="md">
              <Compass className="w-4 h-4 mr-1.5" /> Explore Career Bank
            </PrimaryButton>
          </Link>
        </div>
      )}
    </div>
  );
}

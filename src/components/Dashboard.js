import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { ChartIcon, SpinnerIcon } from "./icons";

export default function Dashboard({ links = [], onRefresh, onViewAnalytics, onCopied, showToast }) {
  const { deleteUserUrl } = useAuth();
  const [filteredLinks, setFilteredLinks] = useState(links);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
    } catch (err) {
      showToast("Failed to refresh links data");
    } finally {
      setRefreshing(false);
    }
  };

  // Filter links on search change or links change
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredLinks(links);
    } else {
      setFilteredLinks(
        links.filter(
          (link) =>
            link.shortId.toLowerCase().includes(q) ||
            (link.redirectURL || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, links]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUserUrl(deleteTarget);
      showToast("Link deleted successfully");
      setDeleteTarget(null);
      if (onRefresh) await onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to delete link");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Compute metrics
  const totalUrls = links.length;
  const totalClicks = links.reduce(
    (sum, link) => sum + (link.visitHistory?.length || 0),
    0
  );
  const averageClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center md:text-left md:flex md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            Link Dashboard
          </h1>
          <p className="text-google-gray dark:text-slate-400">
            View detailed stats and manage your shortened links
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-3 md:mt-0 px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 border border-google-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 justify-center disabled:opacity-50"
        >
          {refreshing ? (
            <SpinnerIcon className="w-4 h-4 text-google-blue animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.235" />
            </svg>
          )}
          Refresh Data
        </button>
      </section>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-google-blue dark:text-blue-400 flex items-center justify-center text-2xl">
            🔗
          </div>
          <div>
            <p className="text-xs text-google-gray dark:text-slate-400 uppercase font-semibold tracking-wider">Total Links</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{totalUrls}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <p className="text-xs text-google-gray dark:text-slate-400 uppercase font-semibold tracking-wider">Total Clicks</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{totalClicks}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <p className="text-xs text-google-gray dark:text-slate-400 uppercase font-semibold tracking-wider">Avg. Clicks</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{averageClicks}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Search and Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-google-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-google-blue/20 outline-none transition-all duration-200"
            />
          </div>
          <div className="text-xs text-google-gray dark:text-slate-400 font-medium">
            Showing {filteredLinks.length} of {totalUrls} links
          </div>
        </div>

        {/* Loading/Error/List */}
        {refreshing && filteredLinks.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-google-gray">
            <SpinnerIcon className="w-8 h-8 text-google-blue animate-spin" />
            <p className="text-sm font-medium">Loading history details...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-12 text-center text-google-gray dark:text-slate-400">
            <p className="text-base font-semibold mb-2">No links found</p>
            <p className="text-sm mb-4">
              {searchQuery ? "Try altering your search keywords" : "Start shortening URLs to see them listed here!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-google-gray dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 sm:p-5">Short Link</th>
                  <th className="p-4 sm:p-5">Destination URL</th>
                  <th className="p-4 sm:p-5 text-center">Clicks</th>
                  <th className="p-4 sm:p-5 text-center">Created</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLinks.map((link) => {
                  const shortUrl = getShortUrl(link.shortId);
                  const dateStr = new Date(link.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <tr key={link.shortId} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="p-4 sm:p-5 font-medium whitespace-nowrap">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-google-blue dark:text-blue-400 hover:underline"
                        >
                          {shortUrl}
                        </a>
                      </td>
                      <td className="p-4 sm:p-5 max-w-xs sm:max-w-sm truncate text-sm text-gray-700 dark:text-slate-300" title={link.redirectURL}>
                        {link.redirectURL}
                      </td>
                      <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 border border-blue-100 dark:border-blue-950">
                          {link.visitHistory?.length || 0} clicks
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-xs text-google-gray dark:text-slate-400 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="p-4 sm:p-5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <CopyButton text={shortUrl} className="!p-1.5 !rounded-lg text-google-gray hover:text-google-blue border border-google-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" />
                          <button
                            onClick={() => onViewAnalytics(link.shortId)}
                            className="p-1.5 rounded-lg border border-google-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-google-gray hover:text-google-blue transition-all"
                            title="View Stats"
                          >
                            <ChartIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(link.shortId)}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                            title="Delete Link"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in text-gray-900 dark:text-white">
          <div className="fixed inset-0" onClick={() => setDeleteTarget(null)}></div>
          <div className="relative w-full max-w-sm p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-10 transition-all duration-300 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold">Delete Short Link?</h3>
            <p className="text-sm text-google-gray dark:text-slate-400 mt-2 mb-6">
              Are you sure you want to delete this shortened link? All history, clicks, and analytics details will be permanently removed.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-red-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                {deleteLoading ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 text-white" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

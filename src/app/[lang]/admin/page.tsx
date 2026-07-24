// src/app/[lang]/admin/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { getDictionary } from '@/lib/get-dictionary';
import { GridPattern, OrganicBlob } from '@/components/brand/PatternBackground';
import { KeyRound, LogOut, Plus, Trash2, Pencil, X, Mail, FileText, LayoutGrid, Users, Download, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminPageProps {
  params: Promise<{ lang: string }>;
}

export default function AdminDashboard({ params }: AdminPageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'fr';
  const [dict, setDict] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard lists
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'messages' | 'assets'>('blog');

  // Forms state
  const [newPost, setNewPost] = useState({ title: '', category: 'IA', excerpt: '', content: '' });
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postError, setPostError] = useState('');
  const [newProject, setNewProject] = useState({ title: '', tagline: '', description: '', category: 'Animation' });

  useEffect(() => {
    getDictionary(lang).then((d) => setDict(d));
  }, [lang]);

  // Load dashboard data — the API rejects the request with 401 if there's no
  // valid session cookie, so this also doubles as the session check.
  const fetchDashboardData = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin');
      if (!res.ok) return false;
      const data = await res.json();
      setBlogPosts(data.blogPosts || []);
      setProjects(data.projects || []);
      setPartners(data.partners || []);
      setDownloads(data.downloads || []);
      setContactMessages(data.contactMessages || []);
      return true;
    } catch (e) {
      console.error('Fetch dashboard error:', e);
      return false;
    }
  };

  useEffect(() => {
    fetchDashboardData().then((ok) => {
      setIsLoggedIn(ok);
      setCheckingSession(false);
    });
  }, []);

  if (!dict || checkingSession) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassword('');
        await fetchDashboardData();
        setIsLoggedIn(true);
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (err) {
      console.error(err);
    }
    setIsLoggedIn(false);
  };

  const resetPostForm = () => {
    setNewPost({ title: '', category: 'IA', excerpt: '', content: '' });
    setPostImage(null);
    setPostImagePreview(null);
    setEditingPostId(null);
    setPostError('');
  };

  const handleEditPost = (post: any) => {
    setEditingPostId(post.id);
    setNewPost({ title: post.title, category: post.category, excerpt: post.excerpt, content: post.content });
    setPostImage(null);
    setPostImagePreview(post.coverImage);
    setPostError('');
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPostImage(file);
    if (file) setPostImagePreview(URL.createObjectURL(file));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    const formData = new FormData();
    formData.append('action', editingPostId ? 'update_post' : 'add_post');
    if (editingPostId) formData.append('id', editingPostId);
    formData.append('title', newPost.title);
    formData.append('category', newPost.category);
    formData.append('excerpt', newPost.excerpt);
    formData.append('content', newPost.content);
    if (postImage) formData.append('image', postImage);

    try {
      const res = await fetch('/api/admin', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        resetPostForm();
        fetchDashboardData();
      } else {
        setPostError(data.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      console.error(err);
      setPostError('Erreur réseau');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_project', ...newProject }),
      });
      if (res.ok) {
        setNewProject({ title: '', tagline: '', description: '', category: 'Animation' });
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (action: 'delete_post' | 'delete_project' | 'delete_message', id: string) => {
    if (!confirm(lang === 'fr' ? 'Confirmer la suppression ?' : 'Confirm deletion?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // LOGIN VIEW
  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center py-16 px-6">
        <GridPattern />
        <OrganicBlob color="terracotta" className="top-10 -left-20 opacity-30" />
        <OrganicBlob color="green" className="bottom-20 -right-20 opacity-20" />

        <div className="w-full max-w-[420px] p-8 rounded-3xl glass border border-[var(--color-border)] shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-terracotta-gold flex items-center justify-center text-white shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-deep-green dark:text-off-white mt-2">
              AIS Admin Panel
            </h1>
            <p className="text-xs text-deep-green/60 dark:text-off-white/60 font-semibold uppercase tracking-wider">
              {lang === 'fr' ? 'Accès réservé aux éditeurs' : 'Editors access only'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@africaimpact.studio"
                className="px-4 py-3 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta text-sm font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                {lang === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword
                      ? lang === 'fr' ? 'Masquer le mot de passe' : 'Hide password'
                      : lang === 'fr' ? 'Afficher le mot de passe' : 'Show password'
                  }
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-deep-green/50 dark:text-off-white/50 hover:text-terracotta cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-500 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/25">
                ⚠️ {authError}
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <KeyRound className="w-4 h-4" />
              {lang === 'fr' ? 'Se connecter' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-6">
      <GridPattern />
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-deep-green dark:text-off-white">
              AIS Editorial Dashboard
            </h1>
            <p className="text-xs text-terracotta dark:text-gold font-bold uppercase tracking-wider mt-1">
              Role: Admin &middot; Authenticated
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20 cursor-pointer w-fit"
          >
            <LogOut className="w-4 h-4" />
            {lang === 'fr' ? 'Se déconnecter' : 'Log out'}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'blog' ? 'bg-terracotta text-white' : 'glass border border-[var(--color-border)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog Posts ({blogPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'projects' ? 'bg-terracotta text-white' : 'glass border border-[var(--color-border)]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'messages' ? 'bg-terracotta text-white' : 'glass border border-[var(--color-border)]'
            }`}
          >
            <Mail className="w-4 h-4" />
            Contact Inquiries ({contactMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'assets' ? 'bg-terracotta text-white' : 'glass border border-[var(--color-border)]'
            }`}
          >
            <Users className="w-4 h-4" />
            Partners & Downloads
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="p-6 rounded-2xl glass border border-[var(--color-border)] shadow-xl min-h-[300px]">
          {/* TAB 1: BLOG */}
          {activeTab === 'blog' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Add form */}
              <div className="lg:col-span-5 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-[var(--color-border)]/50 pb-6 lg:pb-0 lg:pr-8">
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-2">
                  {editingPostId ? (lang === 'fr' ? 'Modifier l\'article' : 'Edit Blog Post') : (lang === 'fr' ? 'Créer un article' : 'Create Blog Post')}
                </h3>
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-1">
                    <label>Title</label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Article title"
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)]"
                    >
                      <option value="IA">IA (AI)</option>
                      <option value="Cybersécurité">Cybersécurité</option>
                      <option value="Animation">Animation</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Excerpt (Teaser)</label>
                    <input
                      type="text"
                      required
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                      placeholder="Brief article summary"
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Content (Markdown support)</label>
                    <textarea
                      rows={5}
                      required
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Article body content..."
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>{lang === 'fr' ? 'Image de couverture' : 'Cover Image'}</label>
                    {postImagePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={postImagePreview}
                        alt="Aperçu"
                        className="w-full aspect-video object-cover rounded-lg border border-[var(--color-border)] mb-1"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePostImageChange}
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none file:mr-2 file:px-2 file:py-1 file:rounded-md file:border-0 file:bg-terracotta/10 file:text-terracotta file:font-bold file:cursor-pointer cursor-pointer"
                    />
                    <span className="text-[10px] font-medium opacity-60 normal-case">
                      {lang === 'fr'
                        ? `JPEG, PNG, WEBP ou GIF, 5 Mo max.${editingPostId ? ' Laisser vide pour garder l\'image actuelle.' : ' Optionnel — une image par défaut sera utilisée sinon.'}`
                        : `JPEG, PNG, WEBP or GIF, 5MB max.${editingPostId ? ' Leave empty to keep the current image.' : ' Optional — a default image is used otherwise.'}`}
                    </span>
                  </div>
                  {postError && (
                    <p className="text-xs text-red-500 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/25">
                      ⚠️ {postError}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button type="submit" className="flex-1 p-2.5 rounded-lg bg-terracotta text-white font-bold hover:bg-terracotta-light transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                      {editingPostId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingPostId ? (lang === 'fr' ? 'Mettre à jour' : 'Update Post') : (lang === 'fr' ? 'Publier' : 'Publish Post')}
                    </button>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={resetPostForm}
                        className="p-2.5 rounded-lg bg-black/5 dark:bg-white/10 font-bold hover:bg-black/10 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        {lang === 'fr' ? 'Annuler' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-7 overflow-x-auto">
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-4">
                  Published Articles
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]/50 pb-2 font-bold opacity-60">
                      <th className="py-2">Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="border-b border-[var(--color-border)]/20">
                        <td className="py-3 font-bold max-w-[200px] truncate">{post.title}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded bg-deep-green/10 text-deep-green text-[10px] font-bold">
                            {post.category}
                          </span>
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="text-right whitespace-nowrap">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-1.5 text-terracotta hover:bg-terracotta/10 rounded-lg cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('delete_post', post.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Add form */}
              <div className="lg:col-span-5 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-[var(--color-border)]/50 pb-6 lg:pb-0 lg:pr-8">
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-2">
                  Create Project
                </h3>
                <form onSubmit={handleAddProject} className="flex flex-col gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-1">
                    <label>Project Title</label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Studio E-learning"
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Tagline (Subheader)</label>
                    <input
                      type="text"
                      required
                      value={newProject.tagline}
                      onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                      placeholder="Brief catchy tagline"
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Category</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)]"
                    >
                      <option value="Animation">Animation</option>
                      <option value="Cybersécurité">Cybersécurité</option>
                      <option value="IA">IA</option>
                      <option value="Formation">Formation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Description</label>
                    <textarea
                      rows={4}
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Full project description..."
                      className="p-2.5 rounded-lg bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none resize-none"
                    />
                  </div>
                  <button type="submit" className="p-2.5 rounded-lg bg-terracotta text-white font-bold hover:bg-terracotta-light transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> Save Project
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-7 overflow-x-auto">
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-4">
                  Active Projects
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]/50 pb-2 font-bold opacity-60">
                      <th className="py-2">Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id} className="border-b border-[var(--color-border)]/20">
                        <td className="py-3 font-bold">{proj.title}</td>
                        <td>{proj.category}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            proj.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gold/10 text-gold'
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteItem('delete_project', proj.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-4">
                Received Messages
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)]/50 pb-2 font-bold opacity-60">
                    <th className="py-2">Sender</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 opacity-60 font-semibold">
                        No messages received yet.
                      </td>
                    </tr>
                  ) : (
                    contactMessages.map((msg) => (
                      <tr key={msg.id} className="border-b border-[var(--color-border)]/20 align-top">
                        <td className="py-3 font-bold whitespace-nowrap">{msg.name}</td>
                        <td className="py-3">{msg.email}</td>
                        <td className="py-3 font-bold">{msg.subject}</td>
                        <td className="py-3 pr-4 max-w-[300px]">{msg.message}</td>
                        <td className="py-3">{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteItem('delete_message', msg.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: PARTNERS & DOWNLOADS */}
          {activeTab === 'assets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Partners list */}
              <div>
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-4 flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-terracotta" /> Institutional Partners List (In Dev)
                </h3>
                <div className="flex flex-col gap-2.5 text-xs font-semibold">
                  {partners.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-[var(--color-border)]/50 bg-white/30 dark:bg-charcoal/30 flex items-center justify-between">
                      <span>{p.name}</span>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-gold bg-gold/10 px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloads list */}
              <div>
                <h3 className="font-display font-bold text-base text-deep-green dark:text-gold mb-4 flex items-center gap-1.5">
                  <Download className="w-5 h-5 text-terracotta" /> Download Tracking Statistics
                </h3>
                <div className="flex flex-col gap-2.5 text-xs font-semibold">
                  {downloads.map((d) => (
                    <div key={d.id} className="p-3 rounded-xl border border-[var(--color-border)]/50 bg-white/30 dark:bg-charcoal/30 flex items-center justify-between">
                      <div>
                        <span className="block font-bold">{d.name}</span>
                        <span className="text-[10px] opacity-60 font-medium">Size: {d.fileSize}</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-terracotta dark:text-gold bg-terracotta/10 px-2.5 py-1 rounded-lg">
                        {d.downloadCount} downloads
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  Send, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Flame, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { CanvaTemplateAsset, GeneratedPost } from '../types';
import { soundFx } from '../utils/soundEffects';

interface PostQueueSchedulerProps {
  posts: GeneratedPost[];
  setPosts: React.Dispatch<React.SetStateAction<GeneratedPost[]>>;
  canvaAssets: CanvaTemplateAsset[];
  onOpenCanvaAsset: (assetId: string) => void;
  brandName: string;
}

export const PostQueueScheduler: React.FC<PostQueueSchedulerProps> = ({
  posts,
  setPosts,
  canvaAssets,
  onOpenCanvaAsset,
  brandName,
}) => {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<GeneratedPost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'instagram' | 'tiktok' | 'x' | 'linkedin'>('instagram');
  const [newCaption, setNewCaption] = useState('');
  const [newSchedule, setNewSchedule] = useState('2026-11-12T14:00');

  const filteredPosts = posts.filter(post => {
    if (filterPlatform !== 'all' && post.platform !== filterPlatform) return false;
    if (filterStatus !== 'all' && post.status !== filterStatus) return false;
    return true;
  });

  const handleCopyCaption = (post: GeneratedPost) => {
    soundFx.playClick();
    const fullText = `${post.caption}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishNow = (postId: string) => {
    soundFx.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FEF08A', '#86EFAC', '#292524'],
    });

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            status: 'published',
            likesCount: (p.likesCount || 0) + 1,
          };
        }
        return p;
      })
    );
  };

  const handleDeletePost = (postId: string) => {
    soundFx.playClick();
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    soundFx.playSuccess();
    setPosts(prev => prev.map(p => (p.id === editingPost.id ? editingPost : p)));
    setEditingPost(null);
  };

  const handleCreatePost = () => {
    soundFx.playSuccess();
    const captionText = newCaption || `Exciting updates from ${brandName}! Tap our link in bio.`;
    const hashtags = ['#SimplyLemon', `#${brandName.replace(/\s+/g, '')}`, '#PixelArt'];
    const newPost: GeneratedPost = {
      id: `post_${Date.now()}`,
      templateAssetId: canvaAssets[0]?.id || 'asset_01',
      photo_id: 'img_01.jpg',
      platform: newPlatform,
      title: newTitle || 'Custom Quick Post',
      hook: captionText.slice(0, 50) + '...',
      caption: captionText,
      hashtags,
      callToAction: 'Check out our bio for details!',
      day: 'Monday',
      format: 'Feed (1080x1080px)',
      full_text: `${captionText}\n\n${hashtags.join(' ')}`,
      bestTimeToPost: 'Scheduled manually',
      status: 'scheduled',
      scheduledDate: newSchedule ? new Date(newSchedule).toISOString() : new Date().toISOString(),
      engagementPrediction: 90,
      is_approved: 1,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      reachCount: 0,
    };
    setPosts(prev => [newPost, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewCaption('');
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <span className="bg-[#FEF08A] text-[#292524] px-2 py-0.5 border border-[#292524] font-silk text-[10px] font-bold">INSTAGRAM</span>;
      case 'tiktok':
        return <span className="bg-[#292524] text-[#86EFAC] px-2 py-0.5 border border-[#292524] font-silk text-[10px] font-bold">TIKTOK</span>;
      case 'x':
        return <span className="bg-sky-100 text-sky-900 px-2 py-0.5 border border-[#292524] font-silk text-[10px] font-bold">X (TWITTER)</span>;
      case 'linkedin':
        return <span className="bg-blue-100 text-blue-900 px-2 py-0.5 border border-[#292524] font-silk text-[10px] font-bold">LINKEDIN</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 px-2 py-0.5 border border-[#292524] font-silk text-[10px]">{platform.toUpperCase()}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-pixel text-sm sm:text-base text-[#292524]">
              POST SCHEDULER & DRAFT QUEUES
            </h2>
            <span className="bg-[#FEF08A] text-[#292524] text-[10px] font-pixel px-2 py-0.5 border border-[#292524]">
              {posts.length} IN QUEUE
            </span>
          </div>
          <p className="text-xs text-stone-600 font-body mt-0.5">
            Auto-generated by Agent 3 from Canva templates. Approve, adjust copy, or push live.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#86EFAC] hover:bg-[#4ADE80] text-[#292524] font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Queue New Post</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#FFFDF0] border-3 border-[#292524] p-3 shadow-[3px_3px_0_#292524] flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1 font-silk text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-stone-500 mr-1 text-[11px] hidden sm:inline">Status:</span>
          {['all', 'scheduled', 'draft', 'published'].map(st => (
            <button
              key={st}
              onClick={() => {
                soundFx.playClick();
                setFilterStatus(st);
              }}
              className={`px-3 py-1 text-xs border border-[#292524] cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-[#FDE047] text-[#292524] font-bold shadow-[2px_2px_0_#292524]'
                  : 'bg-white hover:bg-stone-50 text-stone-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1 font-silk text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-stone-500 mr-1 text-[11px] hidden sm:inline">Channel:</span>
          {['all', 'instagram', 'tiktok', 'x', 'linkedin'].map(pl => (
            <button
              key={pl}
              onClick={() => {
                soundFx.playClick();
                setFilterPlatform(pl);
              }}
              className={`px-2.5 py-1 text-xs border border-[#292524] cursor-pointer capitalize ${
                filterPlatform === pl
                  ? 'bg-[#292524] text-[#FEF08A] font-bold'
                  : 'bg-white hover:bg-stone-50 text-stone-700'
              }`}
            >
              {pl === 'x' ? 'X / Twitter' : pl}
            </button>
          ))}
        </div>
      </div>

      {/* Post Cards Grid or Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[4px_4px_0_#292524] p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-[#FEF08A] border-3 border-[#292524] shadow-[2px_2px_0_#292524] p-1 mx-auto flex items-center justify-center">
            <img
              src="/assets/aistudio/image_0835261b.png"
              alt="Lemmy"
              className="w-full h-full object-contain pixel-art"
            />
          </div>
          <h3 className="font-pixel text-xs sm:text-sm text-[#292524]">
            NO REAL POSTS IN QUEUE YET
          </h3>
          <p className="text-xs text-stone-600 font-body max-w-md mx-auto">
            This queue only holds real posts generated by your backend agents or queued manually. Run Agent 3 in the Pipeline tab to draft posts from your Canva templates.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#FEF08A] hover:bg-[#FDE047] text-[#292524] font-silk text-xs font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524] cursor-pointer"
            >
              + Create First Manual Post
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map(post => {
            const matchingAsset = canvaAssets.find(a => a.id === post.templateAssetId) || canvaAssets[0];

          return (
            <div
              key={post.id}
              className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#FFFBEB] p-3 border-b-2 border-[#292524] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlatformBadge(post.platform)}
                  <span className={`text-[10px] font-silk px-2 py-0.5 border border-[#292524] ${
                    post.status === 'published'
                      ? 'bg-[#86EFAC] text-emerald-950 font-bold'
                      : post.status === 'scheduled'
                      ? 'bg-[#FEF08A] text-amber-950'
                      : 'bg-stone-100 text-stone-700'
                  }`}>
                    {post.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-silk text-stone-600">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Viral Index: {post.engagementPrediction}%</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <h3 className="font-pixel text-xs text-[#292524]">
                  {post.title}
                </h3>

                {/* Canva Template Preview Badge */}
                {matchingAsset && (
                  <div
                    onClick={() => {
                      soundFx.playClick();
                      onOpenCanvaAsset(matchingAsset.id);
                    }}
                    className="p-3 border-2 border-[#292524] cursor-pointer hover:opacity-95 transition-all shadow-[2px_2px_0_#292524]"
                    style={{ backgroundColor: matchingAsset.bgColor }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-silk text-[#292524] mb-1">
                      <span className="font-bold">{matchingAsset.badgeText}</span>
                      <span className="bg-[#292524] text-[#FEF08A] px-1.5 py-0.5 text-[9px]">
                        CANVA ASSET
                      </span>
                    </div>
                    <div className="font-pixel text-xs text-[#292524] truncate">
                      {matchingAsset.headline}
                    </div>
                    <div className="text-[11px] text-stone-700 font-body truncate mt-0.5">
                      {matchingAsset.subheadline}
                    </div>
                  </div>
                )}

                {/* Caption Box */}
                <div className="bg-white border-2 border-[#292524] p-3 text-xs font-body text-[#292524] whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                  {post.caption}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-silk bg-[#FEF9C3] text-amber-900 px-1.5 py-0.5 border border-[#292524]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Scheduled Slot */}
                <div className="flex items-center gap-1.5 text-xs font-silk text-[#854D0E] bg-[#FFFBEB] p-2 border border-[#292524]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.bestTimeToPost}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-[#FEF08A] p-3 border-t-2 border-[#292524] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyCaption(post)}
                    className="p-1.5 bg-white hover:bg-stone-100 text-[#292524] border border-[#292524] shadow-[1px_1px_0_#292524] cursor-pointer"
                    title="Copy caption and hashtags"
                  >
                    {copiedId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setEditingPost(post);
                    }}
                    className="p-1.5 bg-white hover:bg-stone-100 text-[#292524] border border-[#292524] shadow-[1px_1px_0_#292524] cursor-pointer"
                    title="Edit caption & parameters"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 bg-white hover:bg-stone-100 text-rose-700 border border-[#292524] shadow-[1px_1px_0_#292524] cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {post.status !== 'published' ? (
                  <button
                    onClick={() => handlePublishNow(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#86EFAC] hover:bg-[#4ADE80] text-[#292524] font-silk text-xs font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-silk text-emerald-800 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Live on Feed</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[8px_8px_0_#292524] max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#292524] pb-2">
              <h3 className="font-pixel text-xs text-[#292524]">EDIT POST CAPTION</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="font-pixel text-xs text-stone-600 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-silk text-xs block mb-1">Post Title</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full bg-white border-2 border-[#292524] p-2 font-silk text-xs"
              />
            </div>

            <div>
              <label className="font-silk text-xs block mb-1">Caption</label>
              <textarea
                rows={5}
                value={editingPost.caption}
                onChange={e => setEditingPost({ ...editingPost, caption: e.target.value })}
                className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingPost(null)}
                className="px-3 py-1.5 bg-white border-2 border-[#292524] font-silk text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-[#86EFAC] border-2 border-[#292524] shadow-[2px_2px_0_#292524] font-silk text-xs font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[8px_8px_0_#292524] max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#292524] pb-2">
              <h3 className="font-pixel text-xs text-[#292524]">QUEUE NEW POST</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="font-pixel text-xs text-stone-600 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-silk text-xs block mb-1">Title / Campaign</label>
              <input
                type="text"
                placeholder="e.g. Flash Lemonade Friday"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-white border-2 border-[#292524] p-2 font-silk text-xs"
              />
            </div>

            <div>
              <label className="font-silk text-xs block mb-1">Channel</label>
              <select
                value={newPlatform}
                onChange={e => setNewPlatform(e.target.value as any)}
                className="w-full bg-white border-2 border-[#292524] p-2 font-silk text-xs"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="x">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="font-silk text-xs block mb-1">Post Caption</label>
              <textarea
                rows={4}
                placeholder="Write caption or hook..."
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
                className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-1.5 bg-white border-2 border-[#292524] font-silk text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-1.5 bg-[#86EFAC] border-2 border-[#292524] shadow-[2px_2px_0_#292524] font-silk text-xs font-bold cursor-pointer"
              >
                Queue Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

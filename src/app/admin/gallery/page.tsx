"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images, Plus, Pencil, Trash2, X, Save, Loader2,
  Upload, Eye, EyeOff, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray, uploadImage } from "@/lib/api";
import toast from "react-hot-toast";

interface Album {
  id: string; title: string; description?: string;
  category: string; coverImageUrl?: string;
  published: boolean; eventDate?: string; createdAt: string;
}
interface GalleryImage { id: string; url: string; caption?: string; displayOrder: number; }

const CATEGORIES = ["EVENTS","SPORTS","CULTURAL","ACADEMIC","INFRASTRUCTURE","OTHER"];

function AlbumModal({ album, onClose, onSaved }: { album?: Album|null; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState({
    title: album?.title ?? "", description: album?.description ?? "",
    category: album?.category ?? "EVENTS", coverImageUrl: album?.coverImageUrl ?? "",
    published: album?.published ?? false, eventDate: album?.eventDate ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file,"aspcs/gallery"); setForm(f=>({...f,coverImageUrl:url})); toast.success("Uploaded!"); }
    catch { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      album?.id ? await api.put(`/gallery/${album.id}`,form) : await api.post("/gallery",form);
      toast.success(album?.id ? "Updated!" : "Created!"); onSaved(); onClose();
    } catch (err:unknown) { toast.error(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{album?"Edit Album":"New Album"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Title <span className="text-brand-gold">*</span></label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Annual Day 2025"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Event Date</label>
              <input type="date" value={form.eventDate} onChange={e=>setForm({...form,eventDate:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none"/>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Cover Image</label>
            <div className="flex gap-2">
              <input value={form.coverImageUrl} onChange={e=>setForm({...form,coverImageUrl:e.target.value})} placeholder="URL or upload →"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
              <label className={cn("flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-brand-slate hover:text-white",uploading&&"pointer-events-none opacity-50")}>
                {uploading?<Loader2 size={13} className="animate-spin"/>:<Upload size={13}/>}
                {uploading?"...":"Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleCover}/>
              </label>
            </div>
            {form.coverImageUrl&&<img src={form.coverImageUrl} alt="cover" className="mt-2 h-20 w-full rounded-xl object-cover opacity-80"/>}
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <div onClick={()=>setForm(f=>({...f,published:!f.published}))}
              className={cn("relative h-5 w-9 rounded-full transition-colors",form.published?"bg-brand-crimson":"bg-white/10")}>
              <div className={cn("absolute top-0 h-5 w-5 rounded-full bg-white shadow transition-transform",form.published?"translate-x-4":"translate-x-0")}/>
            </div>
            <span className="text-sm text-white/70">Publish publicly</span>
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}
            {saving?"Saving...":album?"Update":"Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminGalleryPage() {
  const [albums,     setAlbums]     = useState<Album[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editAlbum,  setEditAlbum]  = useState<Album|null>(null);
  const [activeAlbum,setActiveAlbum]= useState<Album|null>(null);
  const [images,     setImages]     = useState<GalleryImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [uploading,  setUploading]  = useState(false);

  const fetchAlbums = async () => {
    setLoading(true);
    try { setAlbums(toArray<Album>(await api.get<unknown>("/gallery?size=100"))); }
    catch { toast.error("Failed to load albums"); setAlbums([]); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAlbums(); },[]);

  const openAlbum = async (album: Album) => {
    setActiveAlbum(album); setImgLoading(true);
    try { setImages(toArray<GalleryImage>(await api.get<unknown>(`/gallery/${album.id}/images`))); }
    catch { toast.error("Failed to load images"); setImages([]); }
    finally { setImgLoading(false); }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeAlbum) return;
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImage(file, `aspcs/gallery/${activeAlbum.id}`);
        await api.post(`/gallery/${activeAlbum.id}/images`, { url, caption: file.name.replace(/\.[^/.]+$/,"") });
      }
      setImages(toArray<GalleryImage>(await api.get<unknown>(`/gallery/${activeAlbum.id}/images`)));
      toast.success(`${files.length} image${files.length>1?"s":""} added!`);
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value=""; }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try { await api.delete(`/gallery/images/${imageId}`); setImages(imgs=>imgs.filter(i=>i.id!==imageId)); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Delete album and all its images?")) return;
    try { await api.delete(`/gallery/${id}`); setAlbums(a=>a.filter(al=>al.id!==id)); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const handleTogglePublish = async (album: Album) => {
    try { await api.patch(`/gallery/${album.id}/publish`,{}); fetchAlbums(); toast.success(album.published?"Unpublished":"Published"); }
    catch { toast.error("Update failed"); }
  };

  // Image view
  if (activeAlbum) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={()=>{setActiveAlbum(null);setImages([]);}}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-brand-slate hover:text-white">
            <ChevronLeft size={16}/> Albums
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-[var(--text-primary)]">{activeAlbum.title}</h1>
            <p className="text-xs text-[var(--text-muted)]">{images.length} images</p>
          </div>
        </div>
        <label className={cn("btn-primary cursor-pointer py-2.5 text-sm",uploading&&"opacity-50 pointer-events-none")}>
          {uploading?<Loader2 size={16} className="animate-spin"/>:<Plus size={16}/>}
          {uploading?"Uploading...":"Add Images"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImage}/>
        </label>
      </div>
      {imgLoading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ):(
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img,i)=>(
            <motion.div key={img.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.03}}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/8">
              <img src={img.url} alt={img.caption??"Gallery"} className="h-full w-full object-cover"/>
              {img.caption&&(
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="truncate text-[10px] text-white">{img.caption}</p>
                </div>
              )}
              <button onClick={()=>handleDeleteImage(img.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 size={12}/>
              </button>
            </motion.div>
          ))}
          {images.length===0&&!imgLoading&&(
            <div className="col-span-full rounded-2xl border border-white/8 py-20 text-center text-[var(--text-muted)]">
              No images yet. Click "Add Images" to upload.
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Album grid
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Gallery</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{albums.length} albums · {albums.filter(a=>a.published).length} published</p>
        </div>
        <button onClick={()=>{setEditAlbum(null);setModal(true);}} className="btn-primary py-2.5 text-sm">
          <Plus size={16}/> New Album
        </button>
      </div>
      {loading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ):(
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album,i)=>(
            <motion.div key={album.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="card overflow-hidden">
              <div className="relative h-40 cursor-pointer" onClick={()=>openAlbum(album)}>
                {album.coverImageUrl?(
                  <img src={album.coverImageUrl} alt={album.title} className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                ):(
                  <div className="flex h-full items-center justify-center bg-white/3">
                    <Images size={36} className="text-brand-crimson/30"/>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-crimson">{album.category}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    album.published?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-gray-200 bg-gray-50 text-gray-600")}>
                    {album.published?"Published":"Draft"}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[var(--text-primary)] truncate">{album.title}</h3>
                {album.eventDate&&<p className="mt-0.5 text-xs text-[var(--text-muted)]">{new Date(album.eventDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>openAlbum(album)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:text-white">
                    <Images size={12}/> Images
                  </button>
                  <button onClick={()=>handleTogglePublish(album)} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-brand-gold">
                    {album.published?<EyeOff size={14}/>:<Eye size={14}/>}
                  </button>
                  <button onClick={()=>{setEditAlbum(album);setModal(true);}} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-brand-gold">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={()=>handleDeleteAlbum(album.id)} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-red-400">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {albums.length===0&&<div className="col-span-full rounded-2xl border border-white/8 py-20 text-center text-[var(--text-muted)]">No albums yet.</div>}
        </div>
      )}
      <AnimatePresence>
        {modal&&<AlbumModal album={editAlbum} onClose={()=>{setModal(false);setEditAlbum(null);}} onSaved={fetchAlbums}/>}
      </AnimatePresence>
    </div>
  );
}

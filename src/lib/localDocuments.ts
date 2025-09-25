import { get, set, del, keys } from 'idb-keyval';

export interface LocalDocumentRecord {
  id: string;
  title: string;
  original_name: string;
  file_name: string;
  file_path: string; // pseudo path like local://<id>
  file_size: number;
  mime_type: string;
  category: string;
  tags: string[];
  location: string;
  description: string;
  upload_date: string; // ISO string
  is_local_only: boolean;
  ai_summary: string | null;
  blob: Blob; // Actual file contents
}

export const LocalDocuments = {
  async save(file: File, metadata: {
    title?: string;
    category?: string;
    tags?: string; // comma-separated
    location?: string;
    description?: string;
  }): Promise<LocalDocumentRecord> {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const record: LocalDocumentRecord = {
      id,
      title: metadata.title || file.name.split('.')[0],
      original_name: file.name,
      file_name: file.name,
      file_path: `local://${id}`,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
      category: metadata.category || 'Other',
      tags: (metadata.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      location: metadata.location || '',
      description: metadata.description || '',
      upload_date: new Date().toISOString(),
      is_local_only: true,
      ai_summary: null,
      blob: file,
    };

    await set(record.id, record);
    return record;
  },

  async get(id: string): Promise<LocalDocumentRecord | undefined> {
    return await get<LocalDocumentRecord>(id);
  },

  async remove(id: string): Promise<void> {
    await del(id);
  },

  async updateMetadata(id: string, updates: Partial<Omit<LocalDocumentRecord, 'id' | 'blob' | 'file_name' | 'original_name' | 'file_size' | 'mime_type' | 'file_path' | 'upload_date'>>): Promise<LocalDocumentRecord | undefined> {
    const existing = await get<LocalDocumentRecord>(id);
    if (!existing) return undefined;

    const updated: LocalDocumentRecord = {
      ...existing,
      title: updates.title ?? existing.title,
      category: updates.category ?? existing.category,
      tags: (typeof updates.tags === 'string'
        ? (updates.tags as unknown as string).split(',').map(t => t.trim()).filter(Boolean)
        : (updates.tags as string[] | undefined) ?? existing.tags),
      location: updates.location ?? existing.location,
      description: updates.description ?? existing.description,
      is_local_only: updates.is_local_only ?? existing.is_local_only,
    } as LocalDocumentRecord;

    await set(id, updated);
    return updated;
  },

  async list(): Promise<LocalDocumentRecord[]> {
    const allKeys = await keys();
    const results: LocalDocumentRecord[] = [];
    for (const k of allKeys) {
      const rec = await get<LocalDocumentRecord>(String(k));
      if (rec) results.push(rec);
    }
    // Sort by upload_date desc
    return results.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
  }
};
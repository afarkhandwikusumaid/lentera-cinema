import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const bucket = data.get('bucket') as string || 'uploads';
    const folder = data.get('folder') as string || 'brands';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Check size (Max 1MB as requested)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Ukuran file maksimal 1MB' }, { status: 400 });
    }

    // Check type (Must be image)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'File harus berupa gambar' }, { status: 400 });
    }

    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json({ success: false, message: 'Supabase belum dikonfigurasi' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExtension = file.name.split('.').pop() || 'png';
    const filename = `${uniqueSuffix}.${originalExtension}`;
    
    const path = `${folder}/${filename}`; 

    const { data: uploadData, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ success: false, message: `Gagal mengunggah ke Supabase: ${error.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengunggah file' }, { status: 500 });
  }
}

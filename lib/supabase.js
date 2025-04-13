import { createServerClient } from "@supabase/ssr";

export const createClient = (cookieStore) => {
  // Check if we're in a server context
  const isServer = typeof window === 'undefined';
  
  // Use service role key for server-side operations
  const supabaseKey = isServer 
    ? process.env.SUPABASE_SERVICE_ROLE_KEY 
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

// Initialize storage bucket and policies
export const initializeStorage = async (supabase) => {
  try {
    console.log("Starting storage initialization...");
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return { success: false, error: `Error listing buckets: ${listError.message}` };
    }
    
    console.log("Available buckets:", buckets);
    const carImagesBucket = buckets?.find(bucket => bucket.name === 'car-images');

    if (!carImagesBucket) {
      console.log("Car images bucket not found, creating...");
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      });

      if (error) {
        console.error("Error creating bucket:", error);
        return { success: false, error: `Error creating bucket: ${error.message}` };
      }
      
      console.log("Bucket created successfully:", data);
    } else {
      console.log("Car images bucket already exists");
    }

    // Test if we can access the bucket
    try {
      // Try to list files in the bucket to test access
      const { data: files, error: listFilesError } = await supabase.storage
        .from('car-images')
        .list();
      
      if (listFilesError) {
        console.error("Error listing files:", listFilesError);
        return { success: false, error: `Error listing files: ${listFilesError.message}` };
      }
      
      console.log("Successfully accessed bucket, files:", files);
      return { success: true };
    } catch (accessError) {
      console.error("Error accessing bucket:", accessError);
      return { success: false, error: `Error accessing bucket: ${accessError.message}` };
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    return { success: false, error: `Error initializing storage: ${error.message}` };
  }
};


/**
 * Creates a mock Supabase client for development purposes
 * Used when Supabase credentials are not available or initialization fails
 */
export function createMockClient() {
  console.log('Using mock Supabase client - functionality will be limited to local storage');
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          }
        }
      }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Mock auth: Not implemented' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Mock auth: Not implemented' } }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: (table) => ({
      select: (columns) => ({
        order: (column, { ascending }) => Promise.resolve({
          data: [],
          error: null
        }),
        eq: (column, value) => ({
          single: () => Promise.resolve({
            data: null,
            error: null
          }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      upsert: (data) => ({
        select: () => ({
          single: () => Promise.resolve({
            data: null,
            error: null
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({
          error: null
        })
      })
    })
  };
}

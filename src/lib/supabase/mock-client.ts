
/**
 * Creates a mock Supabase client for development purposes
 * Used when Supabase credentials are not available or initialization fails
 */
export function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } })
    },
    from: () => ({
      select: () => ({
        order: () => ({
          data: [],
          error: null
        }),
        eq: () => ({
          single: () => ({
            data: null,
            error: null
          }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      upsert: () => ({
        select: () => ({
          single: () => ({
            data: null,
            error: null
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          error: null
        })
      })
    })
  };
}
